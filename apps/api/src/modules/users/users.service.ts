import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import type { UpdateOnboardingDto } from './dto/update-onboarding.dto';

export interface CreateUserInput {
  email: string;
  passwordHash: string;
  displayName: string;
}

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  findByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { email } });
  }

  findById(id: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { id } });
  }

  create(input: CreateUserInput): Promise<User> {
    const user = this.usersRepository.create(input);
    return this.usersRepository.save(user);
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
}
