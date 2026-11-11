import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AnalyticsModule } from '../analytics/analytics.module';
import { Exercise } from '../exercises/entities/exercise.entity';
import { User } from '../users/entities/user.entity';
import { AiController } from './ai.controller';
import { AiService } from './ai.service';
import { AiUsageService } from './ai-usage.service';
import { AiInteraction } from './entities/ai-interaction.entity';
import { ExerciseHint } from './entities/exercise-hint.entity';
import { PlacementQuiz } from './entities/placement-quiz.entity';

@Module({
  imports: [
    // Exercise/User are already feature-registered by exercises/users
    // modules too — registering their repo here as well doesn't create a
    // module-to-module dependency, so this stays free of the circular
    // import that importing ExercisesModule directly would create
    // (ExercisesModule -> GenerationModule -> AiModule).
    TypeOrmModule.forFeature([
      AiInteraction,
      ExerciseHint,
      PlacementQuiz,
      Exercise,
      User,
    ]),
    AnalyticsModule,
  ],
  controllers: [AiController],
  providers: [AiService, AiUsageService],
  exports: [AiService],
})
export class AiModule {}
