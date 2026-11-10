import { IsIn } from 'class-validator';
import type { ReactionIcon } from '../entities/post-reaction.entity';

const REACTION_ICONS: ReactionIcon[] = [
  'flame',
  'flash',
  'rocket',
  'thumbs_up',
];

export class SetReactionDto {
  @IsIn(REACTION_ICONS)
  icon: ReactionIcon;
}
