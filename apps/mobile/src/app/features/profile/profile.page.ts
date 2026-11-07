import { Component } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent } from '@ionic/angular';
import { ComingSoonComponent } from '../../shared/components/coming-soon/coming-soon.component';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, ComingSoonComponent],
})
export class ProfilePage {}
