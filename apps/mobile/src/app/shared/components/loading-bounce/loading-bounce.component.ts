import { Component } from '@angular/core';
import { TranslatePipe } from '../../pipes/translate.pipe';

@Component({
  selector: 'app-loading-bounce',
  templateUrl: './loading-bounce.component.html',
  styleUrls: ['./loading-bounce.component.scss'],
  imports: [TranslatePipe],
})
export class LoadingBounceComponent {}
