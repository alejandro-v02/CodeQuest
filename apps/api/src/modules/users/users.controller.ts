import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { JwtAccessGuard } from '../auth/guards/jwt-access.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { UsersService } from './users.service';
import { UpdateOnboardingDto } from './dto/update-onboarding.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { toPublicUser } from './users.mapper';
import type { PublicUser } from './users.mapper';

@UseGuards(JwtAccessGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  me(@CurrentUser() user: PublicUser): PublicUser {
    return user;
  }

  @Patch('me/onboarding')
  async updateOnboarding(
    @CurrentUser() user: PublicUser,
    @Body() dto: UpdateOnboardingDto,
  ): Promise<PublicUser> {
    const updated = await this.usersService.updateOnboarding(user.id, dto);
    return toPublicUser(updated);
  }

  @Patch('me/profile')
  async updateProfile(
    @CurrentUser() user: PublicUser,
    @Body() dto: UpdateProfileDto,
  ): Promise<PublicUser> {
    const updated = await this.usersService.updateProfile(user.id, dto);
    return toPublicUser(updated);
  }
}
