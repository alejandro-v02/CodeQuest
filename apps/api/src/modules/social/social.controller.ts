import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post as HttpPost,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { JwtAccessGuard } from '../auth/guards/jwt-access.guard';
import type { PublicUser } from '../users/users.mapper';
import { CreateCommentDto } from './dto/create-comment.dto';
import { CreatePostDto } from './dto/create-post.dto';
import { CreateSocialReportDto } from './dto/create-social-report.dto';
import { SetReactionDto } from './dto/set-reaction.dto';
import { SocialService } from './social.service';
import type {
  CommentDto,
  FeedPage,
  HeatmapDay,
  PostDto,
  ProfileResponse,
} from './social.types';

@UseGuards(JwtAccessGuard)
@Controller('social')
export class SocialController {
  constructor(private readonly socialService: SocialService) {}

  @HttpCode(HttpStatus.OK)
  @HttpPost('follow/:userId')
  follow(
    @CurrentUser() user: PublicUser,
    @Param('userId') userId: string,
  ): Promise<void> {
    return this.socialService.follow(user.id, userId);
  }

  @HttpCode(HttpStatus.OK)
  @Delete('follow/:userId')
  unfollow(
    @CurrentUser() user: PublicUser,
    @Param('userId') userId: string,
  ): Promise<void> {
    return this.socialService.unfollow(user.id, userId);
  }

  @Get('users/:userId/profile')
  getProfile(
    @CurrentUser() user: PublicUser,
    @Param('userId') userId: string,
  ): Promise<ProfileResponse> {
    return this.socialService.getProfile(user.id, userId);
  }

  @Get('users/:userId/heatmap')
  getHeatmap(
    @CurrentUser() user: PublicUser,
    @Param('userId') userId: string,
  ): Promise<HeatmapDay[]> {
    return this.socialService.getHeatmap(user.id, userId);
  }

  @Get('users/:userId/wall')
  getWall(
    @CurrentUser() user: PublicUser,
    @Param('userId') userId: string,
    @Query('before') before?: string,
    @Query('limit') limit?: string,
  ): Promise<FeedPage> {
    return this.socialService.getWall(user.id, userId, before, Number(limit));
  }

  @Get('feed')
  getFeed(
    @CurrentUser() user: PublicUser,
    @Query('before') before?: string,
    @Query('limit') limit?: string,
  ): Promise<FeedPage> {
    return this.socialService.getFeed(user.id, before, Number(limit));
  }

  @HttpCode(HttpStatus.CREATED)
  @HttpPost('posts')
  createPost(
    @CurrentUser() user: PublicUser,
    @Body() dto: CreatePostDto,
  ): Promise<PostDto> {
    return this.socialService.createPost(user.id, dto);
  }

  @HttpCode(HttpStatus.OK)
  @Delete('posts/:postId')
  deletePost(
    @CurrentUser() user: PublicUser,
    @Param('postId') postId: string,
  ): Promise<void> {
    return this.socialService.deletePost(user.id, postId);
  }

  @HttpCode(HttpStatus.OK)
  @HttpPost('posts/:postId/reactions')
  setReaction(
    @CurrentUser() user: PublicUser,
    @Param('postId') postId: string,
    @Body() dto: SetReactionDto,
  ): Promise<void> {
    return this.socialService.setReaction(user.id, postId, dto.icon);
  }

  @HttpCode(HttpStatus.OK)
  @Delete('posts/:postId/reactions')
  removeReaction(
    @CurrentUser() user: PublicUser,
    @Param('postId') postId: string,
  ): Promise<void> {
    return this.socialService.removeReaction(user.id, postId);
  }

  @Get('posts/:postId/comments')
  getComments(@Param('postId') postId: string): Promise<CommentDto[]> {
    return this.socialService.getComments(postId);
  }

  @HttpCode(HttpStatus.CREATED)
  @HttpPost('posts/:postId/comments')
  addComment(
    @CurrentUser() user: PublicUser,
    @Param('postId') postId: string,
    @Body() dto: CreateCommentDto,
  ): Promise<CommentDto> {
    return this.socialService.addComment(user.id, postId, dto.body);
  }

  @HttpCode(HttpStatus.OK)
  @Delete('comments/:commentId')
  deleteComment(
    @CurrentUser() user: PublicUser,
    @Param('commentId') commentId: string,
  ): Promise<void> {
    return this.socialService.deleteComment(user.id, commentId);
  }

  @HttpCode(HttpStatus.OK)
  @HttpPost('reports')
  report(
    @CurrentUser() user: PublicUser,
    @Body() dto: CreateSocialReportDto,
  ): Promise<void> {
    return this.socialService.report(user.id, dto);
  }
}
