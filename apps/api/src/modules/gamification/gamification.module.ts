import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AiInteraction } from '../ai/entities/ai-interaction.entity';
import { User } from '../users/entities/user.entity';
import { GamificationController } from './gamification.controller';
import { GamificationService } from './gamification.service';
import { Streak } from './entities/streak.entity';
import { UserAchievement } from './entities/user-achievement.entity';
import { XpEvent } from './entities/xp-event.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([XpEvent, Streak, UserAchievement, User, AiInteraction]),
  ],
  controllers: [GamificationController],
  providers: [GamificationService],
  exports: [GamificationService],
})
export class GamificationModule {}
