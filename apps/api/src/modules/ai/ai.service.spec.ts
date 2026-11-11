import { ConfigService } from '@nestjs/config';
import { ServiceUnavailableException } from '@nestjs/common';
import { AiQuotaExceededError, AiService } from './ai.service';

// @nestjs/config is ESM-only and Jest can't load it here; the service only
// needs a stand-in for the type.
jest.mock('@nestjs/config', () => ({ ConfigService: class {} }));

const OPENAI_CONFIG = {
  enabled: true,
  apiKey: 'sk-test',
  model: 'test-chat-model',
  embeddingModel: 'test-embedding-model',
};

function buildService(config = OPENAI_CONFIG): AiService {
  const configService = {
    get: () => config,
  } as unknown as ConfigService<never, true>;
  return new AiService(configService);
}

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

function chatReply(content: string | null): Response {
  return jsonResponse({ choices: [{ message: { content } }] });
}

describe('AiService', () => {
  let fetchMock: jest.SpyInstance;

  beforeEach(() => {
    jest.useFakeTimers().setSystemTime(new Date('2026-11-11T12:00:00Z'));
    fetchMock = jest.spyOn(global, 'fetch');
  });

  afterEach(() => {
    fetchMock.mockRestore();
    jest.useRealTimers();
  });

  describe('generateJson', () => {
    it('calls the chat completions API in JSON mode and parses the reply', async () => {
      fetchMock.mockResolvedValue(chatReply('{"ok":true}'));
      const service = buildService();

      await expect(service.generateJson('Eres un tutor.', 'Dame una pista')).resolves.toEqual({ ok: true });

      const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
      expect(url).toBe('https://api.openai.com/v1/chat/completions');
      expect((init.headers as Record<string, string>).Authorization).toBe('Bearer sk-test');

      const body = JSON.parse(init.body as string);
      expect(body.model).toBe('test-chat-model');
      expect(body.response_format).toEqual({ type: 'json_object' });
      expect(body.messages[0].role).toBe('system');
      // JSON mode requires the word "JSON" in the messages.
      expect(body.messages[0].content).toContain('JSON');
      expect(body.messages[0].content).toContain('Eres un tutor.');
      expect(body.messages[1]).toEqual({ role: 'user', content: 'Dame una pista' });
    });

    it('rejects an empty reply and a reply that is not JSON', async () => {
      const service = buildService();

      fetchMock.mockResolvedValueOnce(chatReply(null));
      await expect(service.generateJson('s', 'u')).rejects.toBeInstanceOf(ServiceUnavailableException);

      fetchMock.mockResolvedValueOnce(chatReply('not json'));
      await expect(service.generateJson('s', 'u')).rejects.toBeInstanceOf(ServiceUnavailableException);
    });

    it('refuses to run without an API key', async () => {
      const service = buildService({ ...OPENAI_CONFIG, enabled: false, apiKey: '' });

      expect(service.isEnabled).toBe(false);
      await expect(service.generateJson('s', 'u')).rejects.toBeInstanceOf(ServiceUnavailableException);
      expect(fetchMock).not.toHaveBeenCalled();
    });
  });

  describe('embed', () => {
    it('asks for 1536 dimensions and returns a unit-length vector', async () => {
      fetchMock.mockResolvedValue(jsonResponse({ data: [{ embedding: [3, 4] }] }));
      const service = buildService();

      const vector = await service.embed('hola');

      const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
      expect(url).toBe('https://api.openai.com/v1/embeddings');
      expect(JSON.parse(init.body as string)).toEqual({
        model: 'test-embedding-model',
        input: 'hola',
        dimensions: 1536,
      });
      expect(vector).toEqual([0.6, 0.8]);
    });
  });

  describe('quota handling', () => {
    const quotaReply = () => jsonResponse({ error: { code: 'insufficient_quota' } }, 429);

    it('turns a 429 into a quota error and stops calling OpenAI', async () => {
      fetchMock.mockResolvedValue(quotaReply());
      const service = buildService();

      await expect(service.generateJson('s', 'u')).rejects.toBeInstanceOf(AiQuotaExceededError);
      expect(service.isQuotaBlocked).toBe(true);

      await expect(service.generateJson('s', 'u')).rejects.toBeInstanceOf(AiQuotaExceededError);
      await expect(service.embed('text')).rejects.toBeInstanceOf(AiQuotaExceededError);

      // Only the very first request actually reached OpenAI.
      expect(fetchMock).toHaveBeenCalledTimes(1);
    });

    it('tries again once the cooldown has passed', async () => {
      fetchMock.mockResolvedValueOnce(quotaReply()).mockResolvedValueOnce(chatReply('{"ok":true}'));
      const service = buildService();

      await expect(service.generateJson('s', 'u')).rejects.toBeInstanceOf(AiQuotaExceededError);

      jest.setSystemTime(new Date('2026-11-11T12:06:00Z'));
      expect(service.isQuotaBlocked).toBe(false);
      await expect(service.generateJson('s', 'u')).resolves.toEqual({ ok: true });
      expect(fetchMock).toHaveBeenCalledTimes(2);
    });

    it('does not trip the breaker for other failures', async () => {
      fetchMock.mockResolvedValue(jsonResponse({ error: 'boom' }, 500));
      const service = buildService();

      await expect(service.generateJson('s', 'u')).rejects.not.toBeInstanceOf(AiQuotaExceededError);
      expect(service.isQuotaBlocked).toBe(false);
    });
  });
});
