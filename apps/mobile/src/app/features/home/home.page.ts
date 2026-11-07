import { Component, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonCard,
  IonCardContent,
  IonButton,
  IonIcon,
} from '@ionic/angular';
import { addIcons } from 'ionicons';
import { refresh } from 'ionicons/icons';
import { HealthService } from '../../core/services/health.service';
import type { HealthStatus } from '../../core/services/health.service';
import { StatusPillComponent } from '../../shared/components/status-pill/status-pill.component';
import type { PillState } from '../../shared/components/status-pill/status-pill.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  imports: [
    DatePipe,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonCard,
    IonCardContent,
    IonButton,
    IonIcon,
    StatusPillComponent,
  ],
})
export class HomePage {
  private readonly healthService = inject(HealthService);

  readonly state = signal<PillState>('checking');
  readonly health = signal<HealthStatus | null>(null);
  readonly errorMessage = signal<string | null>(null);

  constructor() {
    addIcons({ refresh });
    this.checkHealth();
  }

  checkHealth(): void {
    this.state.set('checking');
    this.errorMessage.set(null);

    this.healthService.check().subscribe({
        next: (status) => {
          this.health.set(status);
          this.state.set(status.status === 'ok' ? 'ok' : 'error');
        },
        error: () => {
          this.health.set(null);
          this.state.set('error');
          this.errorMessage.set(
            'No se pudo contactar al backend. Revisa que la API esté corriendo y que el teléfono esté en la misma red.',
          );
        },
      });
  }

  get pillLabel(): string {
    switch (this.state()) {
      case 'checking':
        return 'Conectando...';
      case 'ok':
        return 'API OK';
      case 'error':
        return 'Sin conexión';
    }
  }
}
