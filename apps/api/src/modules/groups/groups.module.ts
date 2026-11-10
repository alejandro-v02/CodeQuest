import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Streak } from '../gamification/entities/streak.entity';
import { XpEvent } from '../gamification/entities/xp-event.entity';
import { User } from '../users/entities/user.entity';
import { GroupMember } from './entities/group-member.entity';
import { Group } from './entities/group.entity';
import { GroupsController } from './groups.controller';
import { GroupsService } from './groups.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Group, GroupMember, User, XpEvent, Streak]),
  ],
  controllers: [GroupsController],
  providers: [GroupsService],
})
export class GroupsModule {}
