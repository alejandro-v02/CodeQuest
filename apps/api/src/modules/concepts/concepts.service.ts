import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import type { ProgrammingLanguageSlug } from '../users/entities/user.entity';
import { Concept } from './entities/concept.entity';

export interface ConceptSummary {
  id: string;
  slug: string;
  name: string;
  order: number;
}

@Injectable()
export class ConceptsService {
  constructor(
    @InjectRepository(Concept)
    private readonly conceptRepo: Repository<Concept>,
  ) {}

  async listForLanguage(
    languageSlug: ProgrammingLanguageSlug,
  ): Promise<ConceptSummary[]> {
    const concepts = await this.conceptRepo.find({
      where: { language: { slug: languageSlug } },
      order: { order: 'ASC' },
    });
    return concepts.map((concept) => ({
      id: concept.id,
      slug: concept.slug,
      name: concept.name,
      order: concept.order,
    }));
  }
}
