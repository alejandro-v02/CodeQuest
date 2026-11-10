import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Attempt } from '../exercises/entities/attempt.entity';
import { User } from '../users/entities/user.entity';
import { Follow } from './entities/follow.entity';
import { Notification } from './entities/notification.entity';
import { Post } from './entities/post.entity';
import { PostComment } from './entities/post-comment.entity';
import { PostReaction } from './entities/post-reaction.entity';
import { PostReport } from './entities/post-report.entity';
import { SocialController } from './social.controller';
import { SocialService } from './social.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Post,
      Follow,
      PostReaction,
      PostComment,
      PostReport,
      Notification,
      User,
      Attempt,
    ]),
  ],
  controllers: [SocialController],
  providers: [SocialService],
  exports: [SocialService],
})
export class SocialModule {}
