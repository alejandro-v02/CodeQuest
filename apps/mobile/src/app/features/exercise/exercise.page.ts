import { HttpErrorResponse } from '@angular/common/http';
import { Component, ViewChild, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  ActionSheetController,
  IonButton,
  IonIcon,
  IonContent,
  ViewWillEnter,
} from '@ionic/angular';
import { AiService } from '../../core/services/ai.service';
import { ExercisesService } from '../../core/services/exercises.service';
import { SocialService } from '../../core/services/social.service';
import { CodeEditorComponent } from '../../shared/components/code-editor/code-editor.component';
import { QuizExerciseComponent } from '../../shared/components/quiz-exercise/quiz-exercise.component';
import { FillExerciseComponent } from '../../shared/components/fill-exercise/fill-exercise.component';
import { SortExerciseComponent } from '../../shared/components/sort-exercise/sort-exercise.component';
import { BugExerciseComponent } from '../../shared/components/bug-exercise/bug-exercise.component';
import { LoadingWaveComponent } from '../../shared/components/loading-wave/loading-wave.component';
import { LoadingBounceComponent } from '../../shared/components/loading-bounce/loading-bounce.component';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';
import { I18nService } from '../../core/services/i18n.service';
import { TranslatePipe } from '../../shared/pipes/translate.pipe';
import {
  isAnswerSubmitResult,
  type AnswerSubmitResult,
  type BugPayload,
  type ExerciseDetail,
  type ExerciseReportReason,
  type FillPayload,
  type QuizPayload,
  type RunResult,
  type SortPayload,
  type SubmitOutcome,
  type TestCaseResult,
} from '../../core/models/exercise.model';

const REPORT_REASON_KEYS: { reason: ExerciseReportReason; labelKey: string }[] = [
  { reason: 'wrong_solution', labelKey: 'exercise.report.wrongSolution' },
  { reason: 'unclear_prompt', labelKey: 'exercise.report.unclearPrompt' },
  { reason: 'duplicate', labelKey: 'exercise.report.duplicate' },
  { reason: 'other', labelKey: 'exercise.report.other' },
];

@Component({
  selector: 'app-exercise',
  templateUrl: './exercise.page.html',
  styleUrls: ['./exercise.page.scss'],
  imports: [
    IonButton,
    IonIcon,
    IonContent,
    CodeEditorComponent,
    QuizExerciseComponent,
    FillExerciseComponent,
    SortExerciseComponent,
    BugExerciseComponent,
    LoadingWaveComponent,
    LoadingBounceComponent,
    PageHeaderComponent,
    TranslatePipe,
  ],
})
export class ExercisePage implements ViewWillEnter {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly exercisesService = inject(ExercisesService);
  private readonly aiService = inject(AiService);
  private readonly socialService = inject(SocialService);
  private readonly actionSheetController = inject(ActionSheetController);
  private readonly i18n = inject(I18nService);

  @ViewChild(CodeEditorComponent) private codeEditor?: CodeEditorComponent;

  readonly symbols = ['{', '}', '(', ')', '[', ']', ';', ':', '=', '"', "'", '_'];

  readonly exercise = signal<ExerciseDetail | null>(null);
  readonly code = signal('');
  // Current answer for quiz/fill/sort/bug — shape depends on the exercise
  // type (number | string[] | number for bug's line index).
  readonly answer = signal<number | string[] | null>(null);
  readonly isLoading = signal(true);
  readonly isRunning = signal(false);
  readonly isChecking = signal(false);
  readonly result = signal<RunResult | SubmitOutcome | null>(null);
  readonly errorMessage = signal<string | null>(null);

  readonly isAnswerResult = isAnswerSubmitResult;

  readonly isReporting = signal(false);
  readonly reportSent = signal(false);

  readonly isSharing = signal(false);
  readonly shared = signal(false);

  // Pistas graduales (Fase 5B): revealed one at a time, in order — the
  // button always requests hints().length + 1, so there's no way to skip
  // straight to level 3.
  readonly hints = signal<string[]>([]);
  readonly isLoadingHint = signal(false);
  readonly hintError = signal<string | null>(null);

  readonly isExplaining = signal(false);
  readonly errorExplanation = signal<string | null>(null);
  readonly explainErrorMessage = signal<string | null>(null);

  // Same IonicRouteStrategy caching issue as HomePage/LessonPage: revisiting
  // the exact same exercise (e.g. after submitting and going back) must not
  // reuse stale state from before.
  ionViewWillEnter(): void {
    void this.load();
  }

  async load(): Promise<void> {
    const exerciseId = this.route.snapshot.paramMap.get('id');
    if (!exerciseId) {
      await this.router.navigateByUrl('/tabs/home');
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set(null);

    try {
      const exercise = await this.exercisesService.getExercise(exerciseId);
      this.exercise.set(exercise);
      this.code.set(exercise.starterCode ?? '');
      this.answer.set(null);
      this.result.set(null);
      this.reportSent.set(false);
      this.shared.set(false);
      this.hints.set([]);
      this.hintError.set(null);
      this.errorExplanation.set(null);
      this.explainErrorMessage.set(null);
    } catch {
      this.errorMessage.set(this.i18n.t('exercise.errors.loadFailed'));
    } finally {
      this.isLoading.set(false);
    }
  }

  get quizPayload(): QuizPayload {
    return this.exercise()!.payload as QuizPayload;
  }

  get fillPayload(): FillPayload {
    return this.exercise()!.payload as FillPayload;
  }

  get sortPayload(): SortPayload {
    return this.exercise()!.payload as SortPayload;
  }

  get bugPayload(): BugPayload {
    return this.exercise()!.payload as BugPayload;
  }

  get canCheck(): boolean {
    const answer = this.answer();
    if (answer === null) {
      return false;
    }
    return !Array.isArray(answer) || answer.every((item) => item.trim().length > 0);
  }

  async run(): Promise<void> {
    const exercise = this.exercise();
    if (!exercise || this.isRunning() || this.isChecking()) {
      return;
    }

    this.isRunning.set(true);
    this.errorMessage.set(null);
    this.result.set(null);
    this.errorExplanation.set(null);
    this.explainErrorMessage.set(null);

    try {
      this.result.set(await this.exercisesService.run(exercise.id, this.code()));
    } catch {
      this.errorMessage.set(this.i18n.t('exercise.errors.runFailed'));
    } finally {
      this.isRunning.set(false);
    }
  }

  async submit(): Promise<void> {
    const exercise = this.exercise();
    if (!exercise || this.isRunning() || this.isChecking()) {
      return;
    }

    this.isChecking.set(true);
    this.errorMessage.set(null);
    this.result.set(null);
    this.errorExplanation.set(null);
    this.explainErrorMessage.set(null);

    try {
      const outcome = await this.exercisesService.submit(exercise.id, { code: this.code() });
      this.result.set(outcome);
      if (!isAnswerSubmitResult(outcome) && outcome.allPassed) {
        this.exercise.set({ ...exercise, solved: true });
      }
    } catch {
      this.errorMessage.set(this.i18n.t('exercise.errors.submitFailed'));
    } finally {
      this.isChecking.set(false);
    }
  }

  async checkAnswer(): Promise<void> {
    const exercise = this.exercise();
    const answer = this.answer();
    if (!exercise || answer === null || this.isChecking()) {
      return;
    }

    this.isChecking.set(true);
    this.errorMessage.set(null);
    this.result.set(null);

    try {
      const body =
        exercise.type === 'quiz'
          ? { selectedIndex: answer as number }
          : exercise.type === 'fill'
            ? { answers: answer as string[] }
            : exercise.type === 'sort'
              ? { order: answer as string[] }
              : { lineIndex: answer as number };

      const outcome = await this.exercisesService.submit(exercise.id, body);
      this.result.set(outcome);
      if (isAnswerSubmitResult(outcome) && outcome.passed) {
        this.exercise.set({ ...exercise, solved: true });
      }
    } catch {
      this.errorMessage.set(this.i18n.t('exercise.errors.checkFailed'));
    } finally {
      this.isChecking.set(false);
    }
  }

  formatCorrectAnswer(result: AnswerSubmitResult): string {
    const type = this.exercise()?.type;
    switch (type) {
      case 'quiz':
        return this.quizPayload.options[result.correctAnswer as number];
      case 'fill':
        return (result.correctAnswer as string[]).join(', ');
      case 'sort':
        return (result.correctAnswer as string[]).join('\n');
      case 'bug':
        return `${this.i18n.t('exercise.lineLabel')} ${(result.correctAnswer as number) + 1}`;
      default:
        return '';
    }
  }

  insertSymbol(symbol: string): void {
    this.codeEditor?.insertAtCursor(symbol);
  }

  goBack(): void {
    const lessonId = this.exercise()?.lessonId;
    void this.router.navigateByUrl(lessonId ? `/lesson/${lessonId}` : '/tabs/home');
  }

  async openReportSheet(): Promise<void> {
    const exercise = this.exercise();
    if (!exercise || this.isReporting() || this.reportSent()) {
      return;
    }

    const sheet = await this.actionSheetController.create({
      header: this.i18n.t('exercise.report.header'),
      buttons: [
        ...REPORT_REASON_KEYS.map(({ reason, labelKey }) => ({
          text: this.i18n.t(labelKey),
          handler: () => void this.sendReport(exercise.id, reason),
        })),
        { text: this.i18n.t('common.cancel'), role: 'cancel' },
      ],
    });
    await sheet.present();
  }

  private async sendReport(exerciseId: string, reason: ExerciseReportReason): Promise<void> {
    this.isReporting.set(true);
    try {
      await this.exercisesService.reportExercise(exerciseId, reason);
      this.reportSent.set(true);
    } catch {
      this.errorMessage.set(this.i18n.t('exercise.errors.reportFailed'));
    } finally {
      this.isReporting.set(false);
    }
  }

  async shareToFeed(): Promise<void> {
    const exercise = this.exercise();
    if (!exercise || exercise.type !== 'code' || this.isSharing() || this.shared()) {
      return;
    }

    this.isSharing.set(true);
    try {
      await this.socialService.createPost({
        type: 'solved_exercise',
        exerciseId: exercise.id,
        exerciseTitle: exercise.prompt,
        codeSnippet: this.code(),
      });
      this.shared.set(true);
    } catch {
      this.errorMessage.set(this.i18n.t('exercise.errors.shareFailed'));
    } finally {
      this.isSharing.set(false);
    }
  }

  async requestHint(): Promise<void> {
    const exercise = this.exercise();
    if (!exercise || this.hints().length >= 3 || this.isLoadingHint()) {
      return;
    }

    const nextLevel = (this.hints().length + 1) as 1 | 2 | 3;
    this.isLoadingHint.set(true);
    this.hintError.set(null);

    try {
      const hint = await this.aiService.getHint(exercise.id, nextLevel, exercise.languageSlug);
      this.hints.update((hints) => [...hints, hint.text]);
    } catch (error) {
      this.hintError.set(
        this.i18n.t(
          error instanceof HttpErrorResponse && error.status === 429
            ? 'exercise.errors.aiLimitReached'
            : 'exercise.errors.hintFailed',
        ),
      );
    } finally {
      this.isLoadingHint.set(false);
    }
  }

  firstFailingTestCase(result: RunResult): TestCaseResult | null {
    return result.testCases.find((testCase) => !testCase.passed) ?? null;
  }

  async explainError(): Promise<void> {
    const exercise = this.exercise();
    const current = this.result();
    if (!exercise || !current || this.isExplaining() || isAnswerSubmitResult(current)) {
      return;
    }
    const failing = this.firstFailingTestCase(current);
    if (!failing?.stderr) {
      return;
    }

    this.isExplaining.set(true);
    this.explainErrorMessage.set(null);

    try {
      const response = await this.aiService.explainError(
        exercise.id,
        exercise.languageSlug,
        this.code(),
        failing.stderr,
      );
      this.errorExplanation.set(response.explanation);
    } catch (error) {
      this.explainErrorMessage.set(
        this.i18n.t(
          error instanceof HttpErrorResponse && error.status === 429
            ? 'exercise.errors.aiLimitReached'
            : 'exercise.errors.explainFailed',
        ),
      );
    } finally {
      this.isExplaining.set(false);
    }
  }
}
