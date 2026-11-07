import {
  Injectable,
  Logger,
  ServiceUnavailableException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { AppConfig } from '../../config/configuration';
import type { ProgrammingLanguageSlug } from '../users/entities/user.entity';
import type { ExecutionResult } from './execution.types';

interface PistonRuntime {
  language: string;
  version: string;
  aliases: string[];
}

interface PistonExecuteStage {
  stdout: string;
  stderr: string;
  output: string;
  code: number | null;
  signal: string | null;
}

interface PistonExecuteResponse {
  language: string;
  version: string;
  run: PistonExecuteStage;
  compile?: PistonExecuteStage;
}

// Piston (self-hosted sandbox, Fase 4) identifies a runtime by name, not a
// numeric id like Judge0 — see PLAN.md's original Language.judge0LanguageId,
// dropped in favor of this map once Piston was chosen over Judge0.
const PISTON_LANGUAGE: Record<
  ProgrammingLanguageSlug,
  { name: string; filename: string }
> = {
  python: { name: 'python', filename: 'main.py' },
  javascript: { name: 'javascript', filename: 'main.js' },
  typescript: { name: 'typescript', filename: 'main.ts' },
  cpp: { name: 'c++', filename: 'main.cpp' },
};

// Piston's default container config caps run_timeout at 3000ms; exceeding it
// is a hard 400, not a clamp, so this has to stay at or under that limit.
const RUN_TIMEOUT_MS = 3_000;
const COMPILE_TIMEOUT_MS = 10_000;

@Injectable()
export class PistonService {
  private readonly logger = new Logger(PistonService.name);
  private readonly apiUrl: string;

  // Installed-version cache (language name -> version). Resolved lazily from
  // Piston's own /runtimes list instead of hardcoding versions, since those
  // drift with the image and with `npm run setup:piston`.
  private runtimeVersions: Map<string, string> | null = null;

  constructor(configService: ConfigService<AppConfig, true>) {
    this.apiUrl = configService.get('execution', { infer: true }).pistonApiUrl;
  }

  async run(
    languageSlug: ProgrammingLanguageSlug,
    code: string,
    stdin: string,
  ): Promise<ExecutionResult> {
    const language = PISTON_LANGUAGE[languageSlug];
    const version = await this.resolveVersion(language.name);

    let response: Response;
    try {
      response = await fetch(`${this.apiUrl}/api/v2/execute`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          language: language.name,
          version,
          files: [{ name: language.filename, content: code }],
          stdin,
          run_timeout: RUN_TIMEOUT_MS,
          compile_timeout: COMPILE_TIMEOUT_MS,
        }),
      });
    } catch (error) {
      this.logger.error('Piston is unreachable', error);
      throw new ServiceUnavailableException(
        'No se pudo conectar con el sandbox de ejecución.',
      );
    }

    if (!response.ok) {
      this.logger.error(`Piston returned HTTP ${response.status}`);
      throw new ServiceUnavailableException(
        'El sandbox de ejecución no pudo procesar el código.',
      );
    }

    const body = (await response.json()) as PistonExecuteResponse;

    // A failed compile stage (C++) means the run stage never produced
    // anything useful; surface the compiler's errors instead.
    if (body.compile && body.compile.code !== 0) {
      return {
        stdout: body.compile.stdout,
        stderr: body.compile.stderr,
        exitCode: body.compile.code,
        signal: body.compile.signal,
      };
    }

    return {
      stdout: body.run.stdout,
      stderr: body.run.stderr,
      exitCode: body.run.code,
      signal: body.run.signal,
    };
  }

  private async resolveVersion(pistonLanguage: string): Promise<string> {
    if (!this.runtimeVersions) {
      this.runtimeVersions = await this.fetchRuntimes();
    }

    let version = this.runtimeVersions.get(pistonLanguage);
    if (!version) {
      // Could be stale (package installed after this process started) —
      // refresh once before giving up.
      this.runtimeVersions = await this.fetchRuntimes();
      version = this.runtimeVersions.get(pistonLanguage);
    }

    if (!version) {
      throw new ServiceUnavailableException(
        `El runtime "${pistonLanguage}" no está instalado en Piston. Ejecuta "npm run setup:piston".`,
      );
    }
    return version;
  }

  private async fetchRuntimes(): Promise<Map<string, string>> {
    let response: Response;
    try {
      response = await fetch(`${this.apiUrl}/api/v2/runtimes`);
    } catch (error) {
      this.logger.error('Piston is unreachable', error);
      throw new ServiceUnavailableException(
        'No se pudo conectar con el sandbox de ejecución.',
      );
    }

    if (!response.ok) {
      throw new ServiceUnavailableException(
        'No se pudo leer la lista de lenguajes instalados en Piston.',
      );
    }

    const runtimes = (await response.json()) as PistonRuntime[];
    const versions = new Map<string, string>();
    for (const runtime of runtimes) {
      // Index by canonical name AND every alias (e.g. node's runtime is
      // named "node" but answers to "javascript"/"js" too), since execute()
      // and this service may address it by either.
      versions.set(runtime.language, runtime.version);
      for (const alias of runtime.aliases) {
        versions.set(alias, runtime.version);
      }
    }
    return versions;
  }
}
