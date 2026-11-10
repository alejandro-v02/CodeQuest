import { Component, OnInit, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { IonButton, IonIcon, IonContent, ViewWillEnter } from '@ionic/angular';
import { AuthService } from '../../core/services/auth.service';
import { ConceptsService } from '../../core/services/concepts.service';
import { ExercisesService } from '../../core/services/exercises.service';
import type { ConceptSummary } from '../../core/models/concept.model';
import type { ConceptStat } from '../../core/models/exercise.model';
import { LoadingBounceComponent } from '../../shared/components/loading-bounce/loading-bounce.component';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';
import { EmptyStateComponent } from '../../shared/components/empty-state/empty-state.component';
import { I18nService } from '../../core/services/i18n.service';
import { TranslatePipe } from '../../shared/pipes/translate.pipe';

// Fase 5B "conceptos débiles": the concept list annotated with whether this
// user struggles with it, so Práctica libre can sort/flag it.
interface ConceptRow extends ConceptSummary {
  isWeak: boolean;
}

@Component({
  selector: 'app-practice',
  templateUrl: './practice.page.html',
  styleUrls: ['./practice.page.scss'],
  imports: [
    IonButton,
    IonIcon,
    IonContent,
    LoadingBounceComponent,
    PageHeaderComponent,
    EmptyStateComponent,
    TranslatePipe,
  ],
})
export class PracticePage implements OnInit, ViewWillEnter {
  private readonly authService = inject(AuthService);
  private readonly conceptsService = inject(ConceptsService);
  private readonly exercisesService = inject(ExercisesService);
  private readonly router = inject(Router);
  private readonly i18n = inject(I18nService);

  readonly concepts = signal<ConceptRow[]>([]);
  readonly isLoading = signal(true);
  readonly errorMessage = signal<string | null>(null);
  // Which concept's "next exercise" fetch is in flight, so only that row
  // shows a spinner and taps on other rows are ignored meanwhile.
  readonly startingConceptId = signal<string | null>(null);

  // Coming back from /exercise/:id crosses from the tabs' nested router
  // outlet into the root outlet and back, which can recreate this page
  // without Ionic's ionViewWillEnter firing on the fresh instance. ngOnInit
  // always runs once per instance, so it's kept as a fallback alongside
  // ionViewWillEnter (which still reloads on every ordinary tab revisit).
  ngOnInit(): void {
    void this.loadConcepts();
  }

  ionViewWillEnter(): void {
    void this.loadConcepts();
  }

  async loadConcepts(): Promise<void> {
    // Clears the leftover spinner-lock from a concept tapped just before
    // navigating to /exercise/:id — that tap never clears it on success
    // (only on error), so revisiting this cached page instance would
    // otherwise show the "starting" spinner forever instead of the list.
    this.startingConceptId.set(null);

    const language = this.authService.currentUser()?.preferredLanguage;
    if (!language) {
      this.isLoading.set(false);
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set(null);

    try {
      const [concepts, stats] = await Promise.all([
        this.conceptsService.listForLanguage(language),
        // A failed stats fetch shouldn't block practicing — it only loses
        // the weak-concept sort/badge, not the concept list itself.
        this.exercisesService.getConceptStats(language).catch(() => [] as ConceptStat[]),
      ]);

      const weakIds = new Set(
        stats.filter((stat) => stat.isWeak).map((stat) => stat.conceptId),
      );
      const rows: ConceptRow[] = concepts.map((concept) => ({
        ...concept,
        isWeak: weakIds.has(concept.id),
      }));
      // Array.prototype.sort is stable, so weak concepts move to the front
      // without reshuffling the original order within each group.
      rows.sort((a, b) => Number(b.isWeak) - Number(a.isWeak));

      this.concepts.set(rows);
    } catch {
      this.errorMessage.set(this.i18n.t('practice.errors.loadConceptsFailed'));
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
      this.errorMessage.set(this.i18n.t('practice.errors.generateFailed'));
      this.startingConceptId.set(null);
    }
  }

  goBack(): void {
    void this.router.navigateByUrl('/tabs/home');
  }
}
