import {
  Injectable,
  Logger,
  ServiceUnavailableException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';
import type { AppConfig } from '../../config/configuration';

// text-embedding-3-small outputs 1536-dimension vectors, matching
// `exercises.embedding vector(1536)` (see DatabaseBootstrapService) exactly
// — don't change one without the other.
const GENERATION_MODEL = 'gpt-4o-mini';
const EMBEDDING_MODEL = 'text-embedding-3-small';

@Injectable()
export class AiService {
  private readonly logger = new Logger(AiService.name);
  private readonly client: OpenAI | null;

  constructor(configService: ConfigService<AppConfig, true>) {
    const { enabled, apiKey } = configService.get('openai', { infer: true });
    this.client = enabled ? new OpenAI({ apiKey }) : null;
  }

  get isEnabled(): boolean {
    return this.client !== null;
  }

  // Returns the model's raw parsed JSON — callers validate the shape
  // themselves (see GeneratedExerciseDto) rather than trusting "strict JSON"
  // blindly.
  async generateJson(
    systemPrompt: string,
    userPrompt: string,
  ): Promise<unknown> {
    const client = this.requireClient();

    let content: string | null | undefined;
    try {
      const response = await client.chat.completions.create({
        model: GENERATION_MODEL,
        response_format: { type: 'json_object' },
        temperature: 0.8,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
      });
      content = response.choices[0]?.message.content;
    } catch (error) {
      this.logger.error('OpenAI chat completion failed', error);
      throw new ServiceUnavailableException(
        'No se pudo generar el ejercicio con IA.',
      );
    }

    if (!content) {
      throw new ServiceUnavailableException(
        'OpenAI devolvió una respuesta vacía.',
      );
    }
    try {
      return JSON.parse(content);
    } catch {
      throw new ServiceUnavailableException(
        'OpenAI devolvió un JSON inválido.',
      );
    }
  }

  async embed(text: string): Promise<number[]> {
    const client = this.requireClient();
    try {
      const response = await client.embeddings.create({
        model: EMBEDDING_MODEL,
        input: text,
      });
      return response.data[0].embedding;
    } catch (error) {
      this.logger.error('OpenAI embedding request failed', error);
      throw new ServiceUnavailableException('No se pudo generar el embedding.');
    }
  }

  private requireClient(): OpenAI {
    if (!this.client) {
      throw new ServiceUnavailableException(
        'OPENAI_API_KEY no está configurado; el generador de IA está desactivado.',
      );
    }
    return this.client;
  }
}
