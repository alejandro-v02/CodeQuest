import { IsIn, IsOptional, IsString, MaxLength } from 'class-validator';
import { AVATAR_COLORS, AVATAR_ICONS } from '../avatar-options';

export class UpdateProfileDto {
  @IsOptional()
  @IsString()
  @MaxLength(160)
  bio?: string;

  @IsOptional()
  @IsIn(AVATAR_ICONS)
  avatarIcon?: (typeof AVATAR_ICONS)[number];

  @IsOptional()
  @IsIn(AVATAR_COLORS)
  avatarColor?: (typeof AVATAR_COLORS)[number];

  // Validated against the user's own unlocked UserAchievement rows in
  // UsersService — not here, since that requires a DB lookup. `null` clears
  // the pin.
  @IsOptional()
  @IsString()
  pinnedAchievementSlug?: string | null;
}
