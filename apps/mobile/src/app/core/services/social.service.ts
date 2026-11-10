import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';
import type {
  CommentDto,
  FeedPage,
  HeatmapDay,
  PostDto,
  ProfileResponse,
  ReactionIcon,
  SocialReportReason,
  SocialReportTargetType,
} from '../models/social.model';

export interface CreateTextPostInput {
  type: 'text';
  body: string;
}

export interface CreateSolvedExercisePostInput {
  type: 'solved_exercise';
  exerciseId: string;
  exerciseTitle: string;
  caption?: string;
  codeSnippet: string;
}

export type CreatePostInput = CreateTextPostInput | CreateSolvedExercisePostInput;

@Injectable({ providedIn: 'root' })
export class SocialService {
  private readonly http = inject(HttpClient);
  private readonly base = `${environment.apiUrl}/social`;

  follow(userId: string): Promise<void> {
    return firstValueFrom(this.http.post<void>(`${this.base}/follow/${userId}`, {}));
  }

  unfollow(userId: string): Promise<void> {
    return firstValueFrom(this.http.delete<void>(`${this.base}/follow/${userId}`));
  }

  getProfile(userId: string): Promise<ProfileResponse> {
    return firstValueFrom(
      this.http.get<ProfileResponse>(`${this.base}/users/${userId}/profile`),
    );
  }

  getHeatmap(userId: string): Promise<HeatmapDay[]> {
    return firstValueFrom(
      this.http.get<HeatmapDay[]>(`${this.base}/users/${userId}/heatmap`),
    );
  }

  getWall(userId: string, before?: string): Promise<FeedPage> {
    return firstValueFrom(
      this.http.get<FeedPage>(`${this.base}/users/${userId}/wall`, {
        params: before ? { before } : {},
      }),
    );
  }

  getFeed(before?: string): Promise<FeedPage> {
    return firstValueFrom(
      this.http.get<FeedPage>(`${this.base}/feed`, {
        params: before ? { before } : {},
      }),
    );
  }

  createPost(input: CreatePostInput): Promise<PostDto> {
    return firstValueFrom(this.http.post<PostDto>(`${this.base}/posts`, input));
  }

  deletePost(postId: string): Promise<void> {
    return firstValueFrom(this.http.delete<void>(`${this.base}/posts/${postId}`));
  }

  setReaction(postId: string, icon: ReactionIcon): Promise<void> {
    return firstValueFrom(
      this.http.post<void>(`${this.base}/posts/${postId}/reactions`, { icon }),
    );
  }

  removeReaction(postId: string): Promise<void> {
    return firstValueFrom(this.http.delete<void>(`${this.base}/posts/${postId}/reactions`));
  }

  getComments(postId: string): Promise<CommentDto[]> {
    return firstValueFrom(
      this.http.get<CommentDto[]>(`${this.base}/posts/${postId}/comments`),
    );
  }

  addComment(postId: string, body: string): Promise<CommentDto> {
    return firstValueFrom(
      this.http.post<CommentDto>(`${this.base}/posts/${postId}/comments`, { body }),
    );
  }

  deleteComment(commentId: string): Promise<void> {
    return firstValueFrom(this.http.delete<void>(`${this.base}/comments/${commentId}`));
  }

  report(
    targetType: SocialReportTargetType,
    targetId: string,
    reason: SocialReportReason,
    details?: string,
  ): Promise<void> {
    return firstValueFrom(
      this.http.post<void>(`${this.base}/reports`, { targetType, targetId, reason, details }),
    );
  }
}
