import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonButton,
  IonIcon,
  IonContent,
  ViewWillEnter,
} from '@ionic/angular';
import { AuthService } from '../../core/services/auth.service';
import { ConceptsService } from '../../core/services/concepts.service';
import { ExercisesService } from '../../core/services/exercises.service';
import type { ConceptSummary } from '../../core/models/concept.model';
import { LoadingBounceComponent } from '../../shared/components/loading-bounce/loading-bounce.component';

@Component({
  selector: 'app-practice',
  templateUrl: './practice.page.html',
  styleUrls: ['./practice.page.scss'],
  imports: [
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonButton,
    IonIcon,
    IonContent,
    LoadingBounceComponent,
  ],
})
export class PracticePage implements ViewWillEnter {
  private readonly authService = inject(AuthService);
  private readonly conceptsService = inject(ConceptsService);
  private readonly exercisesService = inject(ExercisesService);
  private readonly router = inject(Router);

  readonly concepts = signal<ConceptSummary[]>([]);
  readonly isLoading = signal(true);
  readonly errorMessage = signal<string | null>(null);
  // Which concept's "next exercise" fetch is in flight, so only that row
  // shows a spinner and taps on other rows are ignored meanwhile.
  readonly startingConceptId = signal<string | null>(null);

  ionViewWillEnter(): void {
    void this.loadConcepts();
  }

  async loadConcepts(): Promise<void> {
    const language = this.authService.currentUser()?.preferredLanguage;
    if (!language) {
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set(null);

    try {
      this.concepts.set(await this.conceptsService.listForLanguage(language));
    } catch {
      this.errorMessage.set('No se pudieron cargar los conceptos.');
    } finally {
      this.isLoading.set(false);
    }
  }

  async practice(concept: ConceptSummary): Promise<void> {
    if (this.startingConceptId()) {
      return;
    }

    this.startingConceptId.set(concept.id);
    this.errorMessage.set(null);

    try {
      const exercise = await this.exercisesService.getNext(concept.id);
      await this.router.navigateByUrl(`/exercise/${exercise.id}`);
    } catch {
      this.errorMessage.set('No se pudo generar un ejercicio. Intenta de nuevo.');
      this.startingConceptId.set(null);
    }
  }

  goBack(): void {
    void this.router.navigateByUrl('/tabs/home');
  }
}
