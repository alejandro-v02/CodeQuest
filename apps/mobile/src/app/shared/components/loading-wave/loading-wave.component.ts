import { Component } from '@angular/core';
import { TranslatePipe } from '../../pipes/translate.pipe';

@Component({
  selector: 'app-loading-wave',
  templateUrl: './loading-wave.component.html',
  styleUrls: ['./loading-wave.component.scss'],
  imports: [TranslatePipe],
})
export class LoadingWaveComponent {}
