import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { IonButton, IonContent, IonIcon, IonSpinner, ViewWillEnter } from '@ionic/angular';
import { GroupsService } from '../../core/services/groups.service';
import { I18nService } from '../../core/services/i18n.service';
import type { GroupRanking, GroupSummary } from '../../core/models/group.model';
import { EmptyStateComponent } from '../../shared/components/empty-state/empty-state.component';
import { LoadingBounceComponent } from '../../shared/components/loading-bounce/loading-bounce.component';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';
import { TranslatePipe } from '../../shared/pipes/translate.pipe';

const NAME_MIN = 3;
const NAME_MAX = 60;
const CODE_MIN = 4;
const CODE_MAX = 8;

@Component({
  selector: 'app-groups',
  templateUrl: './groups.page.html',
  styleUrls: ['./groups.page.scss'],
  imports: [
    IonButton,
    IonContent,
    IonIcon,
    IonSpinner,
    EmptyStateComponent,
    LoadingBounceComponent,
    PageHeaderComponent,
    TranslatePipe,
  ],
})
export class GroupsPage implements OnInit, ViewWillEnter {
  private readonly groupsService = inject(GroupsService);
  private readonly router = inject(Router);
  private readonly i18n = inject(I18nService);

  readonly groups = signal<GroupSummary[]>([]);
  readonly ranking = signal<GroupRanking | null>(null);
  readonly isLoading = signal(true);
  readonly errorMessage = signal<string | null>(null);

  readonly joinCode = signal('');
  readonly isJoining = signal(false);
  readonly joinError = signal<string | null>(null);

  readonly newName = signal('');
  readonly isCreating = signal(false);
  readonly createError = signal<string | null>(null);

  private inFlight: Promise<void> | null = null;

  // /groups is a root-level route entered from the tabs' nested outlet, so
  // ionViewWillEnter can be skipped on a fresh instance (same case as
  // Práctica libre): ngOnInit covers it, and the in-flight guard keeps both
  // hooks from loading twice on the first visit.
  ngOnInit(): void {
    void this.load();
  }

  ionViewWillEnter(): void {
    void this.load();
  }

  load(): Promise<void> {
    this.inFlight ??= this.fetchAll().finally(() => {
      this.inFlight = null;
    });
    return this.inFlight;
  }

  private async fetchAll(): Promise<void> {
    this.isLoading.set(this.groups().length === 0);
    this.errorMessage.set(null);
    try {
      const [groups, ranking] = await Promise.all([
        this.groupsService.listMine(),
        // The ranking is a bonus section; it shouldn't block the list.
        this.groupsService.getRanking().catch(() => null),
      ]);
      this.groups.set(groups);
      this.ranking.set(ranking);
    } catch {
      this.errorMessage.set(this.i18n.t('groups.errors.loadFailed'));
    } finally {
      this.isLoading.set(false);
    }
  }

  onCodeInput(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.joinCode.set(value.toUpperCase().replace(/[^A-Z0-9]/g, ''));
    this.joinError.set(null);
  }

  onNameInput(event: Event): void {
    this.newName.set((event.target as HTMLInputElement).value);
    this.createError.set(null);
  }

  async join(): Promise<void> {
    const code = this.joinCode();
    if (this.isJoining()) {
      return;
    }
    if (code.length < CODE_MIN || code.length > CODE_MAX) {
      this.joinError.set(this.i18n.t('groups.errors.codeLength'));
      return;
    }

    this.isJoining.set(true);
    this.joinError.set(null);
    try {
      const group = await this.groupsService.join(code);
      this.joinCode.set('');
      this.openGroup(group.id);
    } catch (error) {
      const notFound = error instanceof HttpErrorResponse && error.status === 404;
      this.joinError.set(
        this.i18n.t(notFound ? 'groups.errors.codeNotFound' : 'groups.errors.joinFailed'),
      );
    } finally {
      this.isJoining.set(false);
    }
  }

  async create(): Promise<void> {
    const name = this.newName().trim();
    if (this.isCreating()) {
      return;
    }
    if (name.length < NAME_MIN || name.length > NAME_MAX) {
      this.createError.set(this.i18n.t('groups.errors.nameLength'));
      return;
    }

    this.isCreating.set(true);
    this.createError.set(null);
    try {
      const group = await this.groupsService.create(name);
      this.newName.set('');
      this.openGroup(group.id);
    } catch {
      this.createError.set(this.i18n.t('groups.errors.createFailed'));
    } finally {
      this.isCreating.set(false);
    }
  }

  openGroup(groupId: string): void {
    void this.router.navigateByUrl(`/groups/${groupId}`);
  }

  membersLabel(count: number): string {
    return this.i18n.t('groups.members').replace('{n}', String(count));
  }

  weeklyXpLabel(xp: number): string {
    return this.i18n.t('groups.weeklyXpShort').replace('{xp}', String(xp));
  }

  averageXpLabel(xp: number): string {
    return this.i18n.t('groups.averageXp').replace('{xp}', String(xp));
  }

  goBack(): void {
    void this.router.navigateByUrl('/tabs/profile');
  }
}
