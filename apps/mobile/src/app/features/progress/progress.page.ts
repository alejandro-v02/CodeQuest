import { Component } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent } from '@ionic/angular';
import { ComingSoonComponent } from '../../shared/components/coming-soon/coming-soon.component';

@Component({
  selector: 'app-progress',
  templateUrl: './progress.page.html',
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, ComingSoonComponent],
})
export class ProgressPage {}
