import {
  IsIn,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
} from 'class-validator';
import { AVATAR_COLORS, AVATAR_ICONS } from '../avatar-options';

const USERNAME_PATTERN = /^[a-z0-9_]{3,20}$/;

export class UpdateProfileDto {
  // Lowercased and uniqueness-checked in UsersService, not here.
  @IsOptional()
  @Matches(USERNAME_PATTERN, {
    message:
      'El nombre de usuario debe tener 3-20 caracteres (letras, números o _).',
  })
  username?: string;

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
