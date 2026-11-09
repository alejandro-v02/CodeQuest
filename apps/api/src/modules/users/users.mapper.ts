import type { User } from './entities/user.entity';

// placementDifficulty is internal bookkeeping for NextExerciseService, and
// xp is exposed to the client via GET /gamification/me instead — neither is
// something this type needs to carry.
export type PublicUser = Omit<User, 'passwordHash' | 'githubId' | 'placementDifficulty' | 'xp'>;

export function toPublicUser(user: User): PublicUser {
  return {
    id: user.id,
    email: user.email,
    displayName: user.displayName,
    preferredLanguage: user.preferredLanguage,
    dailyGoalMinutes: user.dailyGoalMinutes,
    timezone: user.timezone,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}
