import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Exercise } from './entities/exercise.entity';
import { ExerciseReport } from './entities/exercise-report.entity';
import { UserExerciseHistory } from './entities/user-exercise-history.entity';

const MIN_DIFFICULTY = 1;
const MAX_DIFFICULTY = 5;
// Real attempts needed before a pass rate is trusted — a couple of unlucky
// tries shouldn't retire or re-difficulty an exercise.
const MIN_ATTEMPTS = 8;
// <= this pass rate with enough attempts means the exercise is likely
// broken despite having passed generation-time verification — retire it.
const LOW_PASS_RATE = 0.15;
// >= this pass rate means it's too easy for its labeled difficulty.
const HIGH_PASS_RATE = 0.95;
// <= this (but above LOW_PASS_RATE) means it's harder than its label.
const HARD_PASS_RATE = 0.3;
// Accumulated user reports that retire an exercise outright, regardless of
// pass rate — a strong signal on its own.
const REPORT_RETIRE_THRESHOLD = 3;

// Recalibrates a single exercise's status/difficulty against real usage data
// (UserExerciseHistory, ExerciseReport) — distinct from generation-time
// verification (GenerationService), which only ever sees a fresh exercise in
// isolation and can't know how it performs across real users.
@Injectable()
export class ExerciseRecalibrationService {
  constructor(
    @InjectRepository(Exercise)
    private readonly exerciseRepo: Repository<Exercise>,
    @InjectRepository(ExerciseReport)
    private readonly reportRepo: Repository<ExerciseReport>,
    @InjectRepository(UserExerciseHistory)
    private readonly historyRepo: Repository<UserExerciseHistory>,
  ) {}

  async recalibrate(exerciseId: string): Promise<void> {
    const reportCount = await this.reportRepo.count({
      where: { exerciseId },
    });
    if (reportCount >= REPORT_RETIRE_THRESHOLD) {
      await this.exerciseRepo.update(exerciseId, { status: 'retired' });
      return;
    }

    const [passed, failed] = await Promise.all([
      this.historyRepo.count({ where: { exerciseId, outcome: 'passed' } }),
      this.historyRepo.count({ where: { exerciseId, outcome: 'failed' } }),
    ]);
    const total = passed + failed;
    if (total < MIN_ATTEMPTS) {
      return;
    }

    const passRate = passed / total;
    if (passRate <= LOW_PASS_RATE) {
      await this.exerciseRepo.update(exerciseId, { status: 'retired' });
      return;
    }

    const exercise = await this.exerciseRepo.findOne({
      where: { id: exerciseId },
    });
    if (!exercise) {
      return;
    }

    if (passRate >= HIGH_PASS_RATE && exercise.difficulty > MIN_DIFFICULTY) {
      await this.exerciseRepo.update(exerciseId, {
        difficulty: exercise.difficulty - 1,
      });
    } else if (
      passRate <= HARD_PASS_RATE &&
      exercise.difficulty < MAX_DIFFICULTY
    ) {
      await this.exerciseRepo.update(exerciseId, {
        difficulty: exercise.difficulty + 1,
      });
    }
  }
}
