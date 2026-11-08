import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { DataSource } from 'typeorm';
import { AppModule } from '../app.module';
import { Concept } from '../modules/concepts/entities/concept.entity';
import { Language } from '../modules/courses/entities/language.entity';
import { GenerationService } from '../modules/generation/generation.service';
import { TemplateGeneratorService } from '../modules/generation/templates/template-generator.service';

// Manual trigger for the Fase 5A.2 generator, ahead of the Fase 5A.3 BullMQ
// queue that will call this automatically to backfill the exercise bank.
// Boots the real Nest app context (no HTTP listener) so it reuses the same
// DB connection, config, and DI graph as the running API.
//
// Usage (run from apps/api):
//   npm run generate -- --language=python --concept=condicionales --count=3
//   npm run generate -- --language=python --concept=variables --quiz

interface Args {
  language: string;
  concept: string;
  count: number;
  difficulty: number;
  quiz: boolean;
}

function parseArgs(argv: string[]): Args {
  const map = new Map<string, string>();
  for (const arg of argv) {
    const match = /^--([\w-]+)(?:=(.*))?$/.exec(arg);
    if (match) {
      map.set(match[1], match[2] ?? 'true');
    }
  }

  const language = map.get('language');
  const concept = map.get('concept');
  if (!language || !concept) {
    throw new Error(
      'Usage: npm run generate -- --language=python --concept=condicionales [--count=3] [--difficulty=2] [--quiz]',
    );
  }

  return {
    language,
    concept,
    count: Number(map.get('count') ?? '1'),
    difficulty: Number(map.get('difficulty') ?? '2'),
    quiz: map.has('quiz'),
  };
}

async function run(): Promise<void> {
  const args = parseArgs(process.argv.slice(2));
  const app = await NestFactory.createApplicationContext(AppModule, {
    logger: ['warn', 'error'],
  });

  try {
    const dataSource = app.get(DataSource);
    const language = await dataSource
      .getRepository(Language)
      .findOne({ where: { slug: args.language as never } });
    if (!language) {
      throw new Error(`No language with slug "${args.language}".`);
    }

    const concept = await dataSource
      .getRepository(Concept)
      .findOne({ where: { languageId: language.id, slug: args.concept } });
    if (!concept) {
      throw new Error(
        `No concept "${args.concept}" for language "${args.language}". Run "npm run seed" first.`,
      );
    }

    if (args.quiz) {
      const templateGenerator = app.get(TemplateGeneratorService);
      for (let i = 0; i < args.count; i += 1) {
        const exercise = await templateGenerator.generateQuiz(
          concept.id,
          'variable-arithmetic',
        );
        console.log(`[${i + 1}/${args.count}] quiz approved: ${exercise.id}`);
      }
      return;
    }

    const generationService = app.get(GenerationService);
    for (let i = 0; i < args.count; i += 1) {
      const result = await generationService.generateCodeExercise(
        concept.id,
        args.difficulty,
      );
      console.log(
        `[${i + 1}/${args.count}] ${result.outcome}` +
          (result.exerciseId ? ` (${result.exerciseId})` : ''),
      );
    }
  } finally {
    await app.close();
  }
}

run().catch((error: unknown) => {
  console.error('Generation failed:', error);
  process.exit(1);
});
