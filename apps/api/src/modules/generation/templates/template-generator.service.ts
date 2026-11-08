import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Concept } from '../../concepts/entities/concept.entity';
import { Exercise } from '../../exercises/entities/exercise.entity';
import { QUIZ_TEMPLATES } from './quiz-templates';

// Deterministic, parameterized quiz generation — correct by construction
// (the answer is computed with the same arithmetic used to build the
// question), so unlike GenerationService's AI path there's nothing to run
// through Piston or deduplicate; it's approved on the spot.
@Injectable()
export class TemplateGeneratorService {
  constructor(
    @InjectRepository(Concept)
    private readonly conceptRepo: Repository<Concept>,
    @InjectRepository(Exercise)
    private readonly exerciseRepo: Repository<Exercise>,
  ) {}

  async generateQuiz(
    conceptId: string,
    templateKey: string,
  ): Promise<Exercise> {
    const concept = await this.conceptRepo.findOne({
      where: { id: conceptId },
      relations: { language: true },
    });
    if (!concept) {
      throw new NotFoundException('Concept not found');
    }

    const template = QUIZ_TEMPLATES[templateKey];
    if (!template) {
      throw new BadRequestException(`Unknown quiz template "${templateKey}".`);
    }

    const { prompt, payload, difficulty } = template(concept.language.slug);

    return this.exerciseRepo.save(
      this.exerciseRepo.create({
        lessonId: null,
        conceptId: concept.id,
        order: 0,
        type: 'quiz',
        prompt,
        starterCode: null,
        payload,
        difficulty,
        isAiGenerated: false,
        status: 'approved',
      }),
    );
  }
}
