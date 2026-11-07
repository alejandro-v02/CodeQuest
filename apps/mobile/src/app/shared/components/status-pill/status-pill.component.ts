import { Component, input } from '@angular/core';

export type PillState = 'checking' | 'ok' | 'error';

@Component({
  selector: 'app-status-pill',
  templateUrl: './status-pill.component.html',
  styleUrls: ['./status-pill.component.scss'],
  imports: [],
})
export class StatusPillComponent {
  readonly state = input.required<PillState>();
  readonly label = input.required<string>();
}
