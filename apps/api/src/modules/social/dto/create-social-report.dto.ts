import { IsIn, IsOptional, IsString, IsUUID, MaxLength } from 'class-validator';
import type {
  SocialReportReason,
  SocialReportTargetType,
} from '../entities/post-report.entity';

const TARGET_TYPES: SocialReportTargetType[] = ['post', 'comment'];
const REASONS: SocialReportReason[] = [
  'spam',
  'offensive',
  'harassment',
  'other',
];

export class CreateSocialReportDto {
  @IsIn(TARGET_TYPES)
  targetType: SocialReportTargetType;

  @IsUUID()
  targetId: string;

  @IsIn(REASONS)
  reason: SocialReportReason;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  details?: string;
}
