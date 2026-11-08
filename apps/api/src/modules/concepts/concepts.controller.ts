import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { JwtAccessGuard } from '../auth/guards/jwt-access.guard';
import type { ProgrammingLanguageSlug } from '../users/entities/user.entity';
import { ConceptsService, type ConceptSummary } from './concepts.service';

@UseGuards(JwtAccessGuard)
@Controller('concepts')
export class ConceptsController {
  constructor(private readonly conceptsService: ConceptsService) {}

  @Get()
  list(
    @Query('languageSlug') languageSlug: ProgrammingLanguageSlug,
  ): Promise<ConceptSummary[]> {
    return this.conceptsService.listForLanguage(languageSlug);
  }
}
