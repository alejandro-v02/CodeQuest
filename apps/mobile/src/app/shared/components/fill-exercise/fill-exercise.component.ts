import { Component, EventEmitter, Input, OnChanges, Output, signal } from '@angular/core';
import type { FillPayload } from '../../../core/models/exercise.model';

// A text segment between/around {{n}} placeholders, or a blank to fill in.
type TemplatePart = { kind: 'text'; value: string } | { kind: 'blank'; index: number };

function parseTemplate(template: string): TemplatePart[] {
  const parts: TemplatePart[] = [];
  const regex = /\{\{(\d+)\}\}/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  while ((match = regex.exec(template))) {
    if (match.index > lastIndex) {
      parts.push({ kind: 'text', value: template.slice(lastIndex, match.index) });
    }
    parts.push({ kind: 'blank', index: Number(match[1]) });
    lastIndex = regex.lastIndex;
  }
  if (lastIndex < template.length) {
    parts.push({ kind: 'text', value: template.slice(lastIndex) });
  }
  return parts;
}

@Component({
  selector: 'app-fill-exercise',
  templateUrl: './fill-exercise.component.html',
  styleUrls: ['./fill-exercise.component.scss'],
})
export class FillExerciseComponent implements OnChanges {
  @Input({ required: true }) payload!: FillPayload;
  @Input() disabled = false;
  @Output() readonly answerChange = new EventEmitter<string[]>();

  protected readonly Math = Math;

  readonly parts = signal<TemplatePart[]>([]);
  readonly answers = signal<string[]>([]);

  ngOnChanges(): void {
    this.parts.set(parseTemplate(this.payload.template));
    this.answers.set(new Array(this.payload.blankCount).fill(''));
  }

  setAnswer(index: number, value: string): void {
    const next = [...this.answers()];
    next[index] = value;
    this.answers.set(next);
    this.answerChange.emit(next);
  }
}
