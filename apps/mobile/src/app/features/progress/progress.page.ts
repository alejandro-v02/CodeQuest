import { Component } from '@angular/core';
import { IonContent } from '@ionic/angular';
import { ComingSoonComponent } from '../../shared/components/coming-soon/coming-soon.component';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';

@Component({
  selector: 'app-progress',
  templateUrl: './progress.page.html',
  imports: [IonContent, ComingSoonComponent, PageHeaderComponent],
})
export class ProgressPage {}
