import { Component, EventEmitter, Input, Output, signal } from '@angular/core';
import type { BugPayload } from '../../../core/models/exercise.model';

@Component({
  selector: 'app-bug-exercise',
  templateUrl: './bug-exercise.component.html',
  styleUrls: ['./bug-exercise.component.scss'],
})
export class BugExerciseComponent {
  @Input({ required: true }) payload!: BugPayload;
  @Input() disabled = false;
  @Output() readonly answerChange = new EventEmitter<number>();

  readonly selectedLine = signal<number | null>(null);

  select(index: number): void {
    if (this.disabled) {
      return;
    }
    this.selectedLine.set(index);
    this.answerChange.emit(index);
  }
}
