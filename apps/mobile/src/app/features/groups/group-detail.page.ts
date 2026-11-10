import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  AlertController,
  IonButton,
  IonContent,
  IonIcon,
  ToastController,
  ViewWillEnter,
} from '@ionic/angular';
import { GroupsService } from '../../core/services/groups.service';
import { I18nService } from '../../core/services/i18n.service';
import type { GroupDetail, GroupMember } from '../../core/models/group.model';
import { LoadingBounceComponent } from '../../shared/components/loading-bounce/loading-bounce.component';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';
import { TranslatePipe } from '../../shared/pipes/translate.pipe';

@Component({
  selector: 'app-group-detail',
  templateUrl: './group-detail.page.html',
  styleUrls: ['./group-detail.page.scss'],
  imports: [
    IonButton,
    IonContent,
    IonIcon,
    LoadingBounceComponent,
    PageHeaderComponent,
    TranslatePipe,
  ],
})
export class GroupDetailPage implements OnInit, ViewWillEnter {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly groupsService = inject(GroupsService);
  private readonly alertController = inject(AlertController);
  private readonly toastController = inject(ToastController);
  private readonly i18n = inject(I18nService);

  readonly detail = signal<GroupDetail | null>(null);
  readonly isLoading = signal(true);
  readonly errorMessage = signal<string | null>(null);
  readonly isBusy = signal(false);

  private inFlight: Promise<void> | null = null;

  // Same root-level-route caveat as the groups list: ngOnInit covers a fresh
  // instance, ionViewWillEnter covers a cached one, the guard dedupes.
  ngOnInit(): void {
    void this.load();
  }

  ionViewWillEnter(): void {
    void this.load();
  }

  load(): Promise<void> {
    this.inFlight ??= this.fetchDetail().finally(() => {
      this.inFlight = null;
    });
    return this.inFlight;
  }

  private async fetchDetail(): Promise<void> {
    // Read the id on every load: a cached page instance can be reused for a
    // different group.
    const groupId = this.route.snapshot.paramMap.get('id');
    if (!groupId) {
      return;
    }
    if (this.detail()?.id !== groupId) {
      this.detail.set(null);
      this.isLoading.set(true);
    }
    this.errorMessage.set(null);
    try {
      this.detail.set(await this.groupsService.getDetail(groupId));
    } catch {
      this.errorMessage.set(this.i18n.t('groups.errors.detailFailed'));
    } finally {
      this.isLoading.set(false);
    }
  }

  async copyCode(code: string): Promise<void> {
    let messageKey = 'groups.detail.copied';
    try {
      await navigator.clipboard.writeText(code);
    } catch {
      messageKey = 'groups.detail.copyFailed';
    }
    const toast = await this.toastController.create({
      message: this.i18n.t(messageKey),
      duration: 1800,
      position: 'bottom',
    });
    await toast.present();
  }

  async kick(member: GroupMember): Promise<void> {
    const detail = this.detail();
    if (!detail) {
      return;
    }
    const header = this.i18n.t('groups.detail.removeMemberTitle').replace('{name}', member.displayName);
    if (!(await this.confirm(header))) {
      return;
    }
    await this.runAction(() => this.groupsService.removeMember(detail.id, member.userId), false);
  }

  async leave(): Promise<void> {
    const detail = this.detail();
    if (!detail || !(await this.confirm(this.i18n.t('groups.detail.leaveConfirm')))) {
      return;
    }
    await this.runAction(() => this.groupsService.leave(detail.id), true);
  }

  async deleteGroup(): Promise<void> {
    const detail = this.detail();
    if (!detail || !(await this.confirm(this.i18n.t('groups.detail.deleteConfirm')))) {
      return;
    }
    await this.runAction(() => this.groupsService.remove(detail.id), true);
  }

  openProfile(userId: string): void {
    void this.router.navigateByUrl(`/profile/${userId}`);
  }

  levelLabel(level: number): string {
    return this.i18n.t('groups.detail.level').replace('{n}', String(level));
  }

  goBack(): void {
    void this.router.navigateByUrl('/groups');
  }

  // After an action either go back to the list (the group is gone for this
  // user) or reload the dashboard.
  private async runAction(action: () => Promise<void>, leavePage: boolean): Promise<void> {
    if (this.isBusy()) {
      return;
    }
    this.isBusy.set(true);
    try {
      await action();
      if (leavePage) {
        this.goBack();
      } else {
        await this.load();
      }
    } catch {
      const toast = await this.toastController.create({
        message: this.i18n.t('groups.errors.actionFailed'),
        duration: 2200,
        position: 'bottom',
      });
      await toast.present();
    } finally {
      this.isBusy.set(false);
    }
  }

  private async confirm(header: string): Promise<boolean> {
    const alert = await this.alertController.create({
      header,
      buttons: [
        { text: this.i18n.t('common.cancel'), role: 'cancel' },
        { text: this.i18n.t('groups.detail.confirm'), role: 'confirm' },
      ],
    });
    await alert.present();
    const { role } = await alert.onDidDismiss();
    return role === 'confirm';
  }
}
