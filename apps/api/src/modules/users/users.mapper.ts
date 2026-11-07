import type { User } from './entities/user.entity';

export type PublicUser = Omit<User, 'passwordHash'>;

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
