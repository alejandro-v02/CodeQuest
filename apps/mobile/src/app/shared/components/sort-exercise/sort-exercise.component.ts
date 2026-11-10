import { Component, EventEmitter, Input, OnChanges, Output, signal } from '@angular/core';
import { CdkDrag, CdkDragDrop, CdkDropList, moveItemInArray } from '@angular/cdk/drag-drop';
import type { SortPayload } from '../../../core/models/exercise.model';
import { TranslatePipe } from '../../pipes/translate.pipe';

@Component({
  selector: 'app-sort-exercise',
  templateUrl: './sort-exercise.component.html',
  styleUrls: ['./sort-exercise.component.scss'],
  imports: [CdkDropList, CdkDrag, TranslatePipe],
})
export class SortExerciseComponent implements OnChanges {
  @Input({ required: true }) payload!: SortPayload;
  @Input() disabled = false;
  @Output() readonly answerChange = new EventEmitter<string[]>();

  readonly blocks = signal<string[]>([]);

  ngOnChanges(): void {
    this.blocks.set([...this.payload.blocks]);
    this.answerChange.emit(this.blocks());
  }

  drop(event: CdkDragDrop<string[]>): void {
    if (this.disabled) {
      return;
    }
    const next = [...this.blocks()];
    moveItemInArray(next, event.previousIndex, event.currentIndex);
    this.blocks.set(next);
    this.answerChange.emit(next);
  }
}
