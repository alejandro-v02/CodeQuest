import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { XpEvent } from '../gamification/entities/xp-event.entity';
import { User } from '../users/entities/user.entity';
import { LeagueGroup } from './entities/league-group.entity';
import { LeagueMembership } from './entities/league-membership.entity';
import { LeaguesController } from './leagues.controller';
import { LeaguesService } from './leagues.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([LeagueGroup, LeagueMembership, User, XpEvent]),
  ],
  controllers: [LeaguesController],
  providers: [LeaguesService],
  exports: [LeaguesService],
})
export class LeaguesModule {}
