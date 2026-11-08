import { Component, EventEmitter, Input, Output, signal } from '@angular/core';
import type { QuizPayload } from '../../../core/models/exercise.model';

@Component({
  selector: 'app-quiz-exercise',
  templateUrl: './quiz-exercise.component.html',
  styleUrls: ['./quiz-exercise.component.scss'],
})
export class QuizExerciseComponent {
  @Input({ required: true }) payload!: QuizPayload;
  @Input() disabled = false;
  @Output() readonly answerChange = new EventEmitter<number>();

  readonly selectedIndex = signal<number | null>(null);

  select(index: number): void {
    if (this.disabled) {
      return;
    }
    this.selectedIndex.set(index);
    this.answerChange.emit(index);
  }
}
