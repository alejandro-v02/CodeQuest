import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserAchievement } from '../gamification/entities/user-achievement.entity';
import { User } from './entities/user.entity';
import type { UpdateOnboardingDto } from './dto/update-onboarding.dto';
import type { UpdateProfileDto } from './dto/update-profile.dto';

export interface CreateUserInput {
  email: string;
  displayName: string;
  passwordHash?: string;
  githubId?: string;
}

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    @InjectRepository(UserAchievement)
    private readonly achievementRepository: Repository<UserAchievement>,
  ) {}

  findByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { email } });
  }

  findById(id: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { id } });
  }

  findByGithubId(githubId: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { githubId } });
  }

  create(input: CreateUserInput): Promise<User> {
    const user = this.usersRepository.create({
      email: input.email,
      displayName: input.displayName,
      passwordHash: input.passwordHash ?? null,
      githubId: input.githubId ?? null,
    });
    return this.usersRepository.save(user);
  }

  async linkGithubId(id: string, githubId: string): Promise<User> {
    await this.usersRepository.update(id, { githubId });
    const user = await this.findById(id);
    if (!user) {
      throw new Error(`User ${id} was deleted while linking GitHub`);
    }
    return user;
  }

  async updateOnboarding(id: string, dto: UpdateOnboardingDto): Promise<User> {
    await this.usersRepository.update(id, dto);
    // Re-fetch instead of trusting the partial update result, so callers
    // always get the full current row.
    const user = await this.findById(id);
    if (!user) {
      throw new Error(`User ${id} was deleted during onboarding update`);
    }
    return user;
  }

  async updateProfile(id: string, dto: UpdateProfileDto): Promise<User> {
    if (dto.username) {
      const username = dto.username.toLowerCase();
      const existing = await this.usersRepository.findOne({
        where: { username },
      });
      if (existing && existing.id !== id) {
        throw new ConflictException('Ese nombre de usuario ya está en uso.');
      }
    }

    if (dto.pinnedAchievementSlug) {
      const unlocked = await this.achievementRepository.findOne({
        where: { userId: id, achievementSlug: dto.pinnedAchievementSlug },
      });
      if (!unlocked) {
        throw new BadRequestException(
          'You can only pin an achievement you unlocked.',
        );
      }
    }

    const update: Partial<User> = {};
    if (dto.username !== undefined)
      update.username = dto.username.toLowerCase();
    if (dto.bio !== undefined) update.bio = dto.bio;
    if (dto.avatarIcon !== undefined) update.avatarIcon = dto.avatarIcon;
    if (dto.avatarColor !== undefined) update.avatarColor = dto.avatarColor;
    // pinnedAchievementSlug can be explicitly null (clear the pin), which
    // must still reach the UPDATE — only an absent key should be skipped.
    if ('pinnedAchievementSlug' in dto) {
      update.pinnedAchievementSlug = dto.pinnedAchievementSlug ?? null;
    }

    await this.usersRepository.update(id, update);
    const user = await this.findById(id);
    if (!user) {
      throw new Error(`User ${id} was deleted during profile update`);
    }
    return user;
  }
}
