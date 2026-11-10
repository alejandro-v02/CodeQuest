import { Controller, Get, UseGuards } from '@nestjs/common';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { JwtAccessGuard } from '../auth/guards/jwt-access.guard';
import type { PublicUser } from '../users/users.mapper';
import { LeaguesService } from './leagues.service';
import type { LeagueDto } from './leagues.types';

@UseGuards(JwtAccessGuard)
@Controller('leagues')
export class LeaguesController {
  constructor(private readonly leaguesService: LeaguesService) {}

  @Get('me')
  getMine(@CurrentUser() user: PublicUser): Promise<LeagueDto> {
    return this.leaguesService.getMyLeague(user.id);
  }
}
