import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { JwtAccessGuard } from '../auth/guards/jwt-access.guard';
import type { PublicUser } from '../users/users.mapper';
import { CreateGroupDto } from './dto/create-group.dto';
import { JoinGroupDto } from './dto/join-group.dto';
import { GroupsService } from './groups.service';
import type {
  GroupDetailDto,
  GroupRankingResponse,
  GroupSummaryDto,
} from './groups.types';

@UseGuards(JwtAccessGuard)
@Controller('groups')
export class GroupsController {
  constructor(private readonly groupsService: GroupsService) {}

  @Post()
  create(
    @CurrentUser() user: PublicUser,
    @Body() dto: CreateGroupDto,
  ): Promise<GroupSummaryDto> {
    return this.groupsService.create(user.id, dto.name);
  }

  @HttpCode(HttpStatus.OK)
  @Post('join')
  join(
    @CurrentUser() user: PublicUser,
    @Body() dto: JoinGroupDto,
  ): Promise<GroupSummaryDto> {
    return this.groupsService.join(user.id, dto.code);
  }

  @Get('mine')
  listMine(@CurrentUser() user: PublicUser): Promise<GroupSummaryDto[]> {
    return this.groupsService.listMine(user.id);
  }

  // Declared before ':id' so "ranking" isn't parsed as a group id.
  @Get('ranking')
  getRanking(@CurrentUser() user: PublicUser): Promise<GroupRankingResponse> {
    return this.groupsService.getRanking(user.id);
  }

  @Get(':id')
  getDetail(
    @CurrentUser() user: PublicUser,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<GroupDetailDto> {
    return this.groupsService.getDetail(user.id, id);
  }

  @HttpCode(HttpStatus.OK)
  @Delete(':id/leave')
  leave(
    @CurrentUser() user: PublicUser,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<void> {
    return this.groupsService.leave(user.id, id);
  }

  @HttpCode(HttpStatus.OK)
  @Delete(':id/members/:userId')
  removeMember(
    @CurrentUser() user: PublicUser,
    @Param('id', ParseUUIDPipe) id: string,
    @Param('userId', ParseUUIDPipe) memberUserId: string,
  ): Promise<void> {
    return this.groupsService.removeMember(user.id, id, memberUserId);
  }

  @HttpCode(HttpStatus.OK)
  @Delete(':id')
  remove(
    @CurrentUser() user: PublicUser,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<void> {
    return this.groupsService.remove(user.id, id);
  }
}
