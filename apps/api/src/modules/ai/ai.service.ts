import {
  Injectable,
  Logger,
  ServiceUnavailableException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { AppConfig } from '../../config/configuration';
import { QuotaBreaker, isQuotaError } from './quota-breaker';

// After a "quota exceeded" answer, AI calls pause this long before one is let
// through to check whether the quota is back (a per-minute limit recovers
// quickly; running out of credit just trips it again).
const QUOTA_COOLDOWN_MS = 5 * 60 * 1000;
const REQUEST_TIMEOUT_MS = 60_000;
const OPENAI_API_URL = 'https://api.openai.com/v1';
// The pgvector column is vector(1536) (see DatabaseBootstrapService).
const EMBEDDING_DIMENSIONS = 1536;
// OpenAI's JSON mode rejects a request whose messages never mention "JSON".
const JSON_INSTRUCTION =
  '\n\nResponde únicamente con un objeto JSON válido, sin texto adicional.';

export class AiQuotaExceededError extends ServiceUnavailableException {
  constructor() {
    super('La IA alcanzó su límite por ahora. Inténtalo más tarde.');
  }
}

// A non-2xx answer from the OpenAI API, keeping the status for quota detection.
class OpenAiHttpError extends Error {
  constructor(
    readonly status: number,
    readonly body: string,
  ) {
    super(`OpenAI responded ${status}: ${body.slice(0, 300)}`);
  }
}

interface ChatCompletionResponse {
  choices?: { message?: { content?: string | null } }[];
}

interface EmbeddingResponse {
  data?: { embedding?: number[] }[];
}

function normalizeVector(values: number[]): number[] {
  const magnitude = Math.sqrt(values.reduce((sum, v) => sum + v * v, 0));
  if (magnitude === 0) return values;
  return values.map((v) => v / magnitude);
}

@Injectable()
export class AiService {
  private readonly logger = new Logger(AiService.name);
  private readonly apiKey: string | null;
  private readonly model: string;
  private readonly embeddingModel: string;
  private readonly quotaBreaker = new QuotaBreaker(QUOTA_COOLDOWN_MS);

  constructor(configService: ConfigService<AppConfig, true>) {
    const { enabled, apiKey, model, embeddingModel } = configService.get(
      'openai',
      { infer: true },
    );
    this.apiKey = enabled ? apiKey : null;
    this.model = model;
    this.embeddingModel = embeddingModel;
  }

  get isEnabled(): boolean {
    return this.apiKey !== null;
  }

  // True while OpenAI is known to be out of quota or credit: callers that can
  // wait (the background generator) should skip work instead of making calls
  // that fail.
  get isQuotaBlocked(): boolean {
    return this.quotaBreaker.isOpen;
  }

  async generateJson(
    systemPrompt: string,
    userPrompt: string,
  ): Promise<unknown> {
    this.assertCanCall();
    let text: string | null | undefined;
    try {
      const response = await this.post<ChatCompletionResponse>(
        '/chat/completions',
        {
          model: this.model,
          messages: [
            { role: 'system', content: systemPrompt + JSON_INSTRUCTION },
            { role: 'user', content: userPrompt },
          ],
          response_format: { type: 'json_object' },
        },
      );
      text = response.choices?.[0]?.message?.content;
    } catch (error) {
      if (isQuotaError(error)) {
        throw this.onQuotaExceeded();
      }
      this.logger.error(
        `OpenAI content generation failed: ${this.describe(error)}`,
      );
      throw new ServiceUnavailableException(
        'No se pudo generar el ejercicio con IA.',
      );
    }
    if (!text) {
      throw new ServiceUnavailableException(
        'La IA devolvió una respuesta vacía.',
      );
    }
    try {
      return JSON.parse(text);
    } catch {
      throw new ServiceUnavailableException('La IA devolvió un JSON inválido.');
    }
  }

  async embed(text: string): Promise<number[]> {
    this.assertCanCall();
    try {
      const response = await this.post<EmbeddingResponse>('/embeddings', {
        model: this.embeddingModel,
        input: text,
        dimensions: EMBEDDING_DIMENSIONS,
      });
      const values = response.data?.[0]?.embedding;
      if (!values) throw new Error('No embedding values in response');
      return normalizeVector(values);
    } catch (error) {
      if (isQuotaError(error)) {
        throw this.onQuotaExceeded();
      }
      this.logger.error(`OpenAI embedding request failed: ${this.describe(error)}`);
      throw new ServiceUnavailableException('No se pudo generar el embedding.');
    }
  }

  private async post<T>(path: string, body: unknown): Promise<T> {
    const response = await fetch(`${OPENAI_API_URL}${path}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    });
    if (!response.ok) {
      throw new OpenAiHttpError(response.status, await response.text());
    }
    return (await response.json()) as T;
  }

  private describe(error: unknown): string {
    return error instanceof Error ? error.message : String(error);
  }

  private onQuotaExceeded(): AiQuotaExceededError {
    this.logger.warn(
      `OpenAI quota exceeded: pausing AI calls for ${QUOTA_COOLDOWN_MS / 60_000} minutes.`,
    );
    this.quotaBreaker.trip();
    return new AiQuotaExceededError();
  }

  private assertCanCall(): void {
    if (this.apiKey === null) {
      throw new ServiceUnavailableException(
        'OPENAI_API_KEY no está configurado; el generador de IA está desactivado.',
      );
    }
    if (this.quotaBreaker.isOpen) {
      throw new AiQuotaExceededError();
    }
  }
}
