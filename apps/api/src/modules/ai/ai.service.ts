import {
  Injectable,
  Logger,
  ServiceUnavailableException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GoogleGenAI } from '@google/genai';
import type { AppConfig } from '../../config/configuration';

const GENERATION_MODEL = 'gemini-3.6-flash';
const EMBEDDING_MODEL = 'gemini-embedding-001';
const EMBEDDING_DIMENSIONS = 1536;

function normalizeVector(values: number[]): number[] {
  const magnitude = Math.sqrt(values.reduce((sum, v) => sum + v * v, 0));
  if (magnitude === 0) return values;
  return values.map((v) => v / magnitude);
}

@Injectable()
export class AiService {
  private readonly logger = new Logger(AiService.name);
  private readonly client: GoogleGenAI | null;

  constructor(configService: ConfigService<AppConfig, true>) {
    const { enabled, apiKey } = configService.get('gemini', { infer: true });
    this.client = enabled ? new GoogleGenAI({ apiKey }) : null;
  }

  get isEnabled(): boolean {
    return this.client !== null;
  }

  async generateJson(systemPrompt: string, userPrompt: string): Promise<unknown> {
    const client = this.requireClient();
    let text: string | undefined;
    try {
      const response = await client.models.generateContent({
        model: GENERATION_MODEL,
        contents: userPrompt,
        config: {
          systemInstruction: systemPrompt,
          responseMimeType: 'application/json',
          temperature: 0.8,
        },
      });
      text = response.text;
    } catch (error) {
      this.logger.error('Gemini content generation failed', error);
      throw new ServiceUnavailableException('No se pudo generar el ejercicio con IA.');
    }
    if (!text) throw new ServiceUnavailableException('Gemini devolvió una respuesta vacía.');
    try {
      return JSON.parse(text);
    } catch {
      throw new ServiceUnavailableException('Gemini devolvió un JSON inválido.');
    }
  }

  async embed(text: string): Promise<number[]> {
    const client = this.requireClient();
    try {
      const response = await client.models.embedContent({
        model: EMBEDDING_MODEL,
        contents: text,
        config: { outputDimensionality: EMBEDDING_DIMENSIONS },
      });
      const values = response.embeddings?.[0]?.values;
      if (!values) throw new Error('No embedding values in response');
      return normalizeVector(values);
    } catch (error) {
      this.logger.error('Gemini embedding request failed', error);
      throw new ServiceUnavailableException('No se pudo generar el embedding.');
    }
  }

  private requireClient(): GoogleGenAI {
    if (!this.client) {
      throw new ServiceUnavailableException(
        'GEMINI_API_KEY no está configurado; el generador de IA está desactivado.',
      );
    }
    return this.client;
  }
}
