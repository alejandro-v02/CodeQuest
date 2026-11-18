import { ServiceUnavailableException } from '@nestjs/common';
import { NextExerciseService } from './next-exercise.service';

// The collaborators' imports pull ESM-only packages that Jest can't load here;
// only their types are needed.
jest.mock('@nestjs/typeorm', () => ({
  InjectRepository: () => () => undefined,
}));
jest.mock('../generation/generation.service', () => ({
  GenerationService: class {},
}));
jest.mock('../generation/templates/template-generator.service', () => ({
  TemplateGeneratorService: class {},
}));
jest.mock('./exercises.service', () => ({ ExercisesService: class {} }));

interface BankExercise {
  id: string;
  difficulty: number;
}

// An in-memory stand-in for the exercise table that understands just the
// conditions NextExerciseService adds to its query builder.
function fakeQueryBuilder(bank: BankExercise[]) {
  const filters: Array<(exercise: BankExercise) => boolean> = [];
  const builder = {
    where: () => builder,
    andWhere: (sql: string, params?: Record<string, unknown>) => {
      if (sql.includes('NOT IN')) {
        const excluded = params?.excludeIds as string[];
        filters.push((exercise) => !excluded.includes(exercise.id));
      } else if (sql.includes('id IN')) {
        const only = params?.onlyIds as string[];
        filters.push((exercise) => only.includes(exercise.id));
      } else if (sql.includes('BETWEEN')) {
        const min = params?.min as number;
        const max = params?.max as number;
        filters.push((e) => e.difficulty >= min && e.difficulty <= max);
      } else if (sql.includes('difficulty =')) {
        const difficulty = params?.difficulty as number;
        filters.push((exercise) => exercise.difficulty === difficulty);
      }
      return builder;
    },
    orderBy: () => builder,
    limit: () => builder,
    getOne: () => {
      const match = bank.find((exercise) => filters.every((f) => f(exercise)));
      return Promise.resolve(match ?? null);
    },
    getCount: () =>
      Promise.resolve(
        bank.filter((exercise) => filters.every((f) => f(exercise))).length,
      ),
  };
  return builder;
}

function build(options: {
  bank: BankExercise[];
  served?: string[];
  solved?: string[];
  generateOutcome?: string;
}) {
  const {
    bank,
    served = [],
    solved = [],
    generateOutcome = 'invalid_shape',
  } = options;
  const exerciseRepo = {
    createQueryBuilder: () => fakeQueryBuilder(bank),
    find: () => Promise.resolve([]),
    findOne: () => Promise.resolve(null),
    manager: {
      createQueryBuilder: () => {
        const chain = {
          select: () => chain,
          from: () => chain,
          innerJoin: () => chain,
          where: () => chain,
          andWhere: () => chain,
          getRawMany: () =>
            Promise.resolve(solved.map((id) => ({ exercise_id: id }))),
        };
        return chain;
      },
    },
  };
  const historyRepo = {
    find: (query: { where: { outcome?: unknown } }) =>
      Promise.resolve(
        // Difficulty lookups (with an outcome filter) find no history;
        // the "already served" lookup returns every served exercise.
        query.where.outcome === undefined
          ? served.map((exerciseId) => ({ exerciseId }))
          : [],
      ),
    create: (row: unknown) => row,
    save: (row: unknown) => Promise.resolve(row),
  };
  const conceptRepo = {
    findOne: () =>
      Promise.resolve({
        id: 'concept-1',
        slug: 'bucles',
        language: { slug: 'python' },
      }),
  };
  const userRepo = { findOne: () => Promise.resolve(null) };
  const generationService = {
    enqueueBackfill: () => Promise.resolve(),
    generateCodeExercise: () => Promise.resolve({ outcome: generateOutcome }),
  };
  const templateGenerator = { generateQuiz: jest.fn() };
  const exercisesService = {
    getLockedLessonIds: () => Promise.resolve([]),
    getExercise: (id: string) => Promise.resolve({ id }),
  };

  const service = new NextExerciseService(
    exerciseRepo as never,
    historyRepo as never,
    conceptRepo as never,
    userRepo as never,
    generationService as never,
    templateGenerator as never,
    exercisesService as never,
  );
  return { service };
}

const bank: BankExercise[] = [
  { id: 'a', difficulty: 1 },
  { id: 'b', difficulty: 1 },
  { id: 'c', difficulty: 1 },
];

describe('NextExerciseService.getNext', () => {
  let random: jest.SpyInstance;

  beforeEach(() => {
    // No "retry an unsolved exercise" roll unless a test asks for it.
    random = jest.spyOn(Math, 'random').mockReturnValue(0.99);
  });

  afterEach(() => {
    random.mockRestore();
  });

  it('never serves an exercise the user already solved', async () => {
    const { service } = build({ bank, solved: ['a'], served: ['a'] });

    const ids = new Set<string>();
    for (let i = 0; i < 10; i += 1) {
      ids.add((await service.getNext('user-1', 'concept-1')).id);
    }

    expect(ids.has('a')).toBe(false);
  });

  it('prefers an exercise the user has not seen over one they left unsolved', async () => {
    const { service } = build({ bank, served: ['a', 'b'], solved: [] });

    const exercise = await service.getNext('user-1', 'concept-1');

    expect(exercise.id).toBe('c');
  });

  it('sometimes brings back an unsolved exercise even when new ones remain', async () => {
    random.mockReturnValue(0.1);
    const { service } = build({ bank, served: ['b'], solved: [] });

    const exercise = await service.getNext('user-1', 'concept-1');

    expect(exercise.id).toBe('b');
  });

  it('falls back to an unsolved exercise when nothing new is left', async () => {
    const { service } = build({
      bank,
      served: ['a', 'b', 'c'],
      solved: ['a', 'c'],
    });

    const exercise = await service.getNext('user-1', 'concept-1');

    expect(exercise.id).toBe('b');
  });

  it('refuses with 503 instead of serving an off-topic exercise when the topic is exhausted', async () => {
    const { service } = build({
      bank,
      served: ['a', 'b', 'c'],
      solved: ['a', 'b', 'c'],
    });

    await expect(service.getNext('user-1', 'concept-1')).rejects.toBeInstanceOf(
      ServiceUnavailableException,
    );
  });
});
