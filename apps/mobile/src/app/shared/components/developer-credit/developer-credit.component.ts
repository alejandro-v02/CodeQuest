import { Component, ElementRef, OnDestroy, ViewChild, signal } from '@angular/core';
import { IonIcon } from '@ionic/angular';
import {
  AVATAR_CANVAS_HEIGHT,
  AVATAR_CANVAS_WIDTH,
  AVATAR_MESSAGES,
  AVATAR_SPRITE_BASE64,
  renderAvatarFrame,
  type AvatarGesture,
} from './developer-avatar-sprite';

const DISPLAY_SCALE = 3;
const MESSAGE_INTERVAL_MS = 3400;

// Loaded once and reused — there's only ever one instance of this component
// on the login page, but this avoids a re-fetch if that ever changes.
let spriteImagePromise: Promise<HTMLImageElement> | null = null;
function loadSprite(): Promise<HTMLImageElement> {
  spriteImagePromise ??= new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('avatar sprite failed to load'));
    img.src = AVATAR_SPRITE_BASE64;
  });
  return spriteImagePromise;
}

@Component({
  selector: 'app-developer-credit',
  templateUrl: './developer-credit.component.html',
  styleUrls: ['./developer-credit.component.scss'],
  imports: [IonIcon],
})
export class DeveloperCreditComponent implements OnDestroy {
  @ViewChild('avatarCanvas', { static: true }) private readonly canvasRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('closeBtn', { static: true }) private readonly closeBtnRef!: ElementRef<HTMLButtonElement>;

  readonly isOpen = signal(false);
  readonly message = signal('');

  readonly spriteUrl = AVATAR_SPRITE_BASE64;
  readonly rawWidth = AVATAR_CANVAS_WIDTH;
  readonly rawHeight = AVATAR_CANVAS_HEIGHT;
  readonly displayWidth = AVATAR_CANVAS_WIDTH * DISPLAY_SCALE;
  readonly displayHeight = AVATAR_CANVAS_HEIGHT * DISPLAY_SCALE;

  private readonly reducedMotion =
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  private sprite: HTMLImageElement | null = null;
  private rafId = 0;
  private messageTimerId = 0;
  private messageIndex = -1;
  private gesture: AvatarGesture = '';
  private gestureStart = 0;

  async open(): Promise<void> {
    this.isOpen.set(true);
    this.closeBtnRef.nativeElement.focus();
    if (!this.sprite) {
      this.sprite = await loadSprite();
    }
    this.playNextMessage();
  }

  close(): void {
    this.isOpen.set(false);
    cancelAnimationFrame(this.rafId);
    window.clearTimeout(this.messageTimerId);
  }

  onBackdropClick(event: MouseEvent): void {
    if (event.target === event.currentTarget) {
      this.close();
    }
  }

  onKeydown(event: KeyboardEvent): void {
    if (event.key === 'Escape') {
      this.close();
    }
  }

  replay(): void {
    if (this.isOpen()) {
      this.playNextMessage();
    }
  }

  ngOnDestroy(): void {
    cancelAnimationFrame(this.rafId);
    window.clearTimeout(this.messageTimerId);
  }

  private playNextMessage(): void {
    window.clearTimeout(this.messageTimerId);
    this.messageIndex = (this.messageIndex + 1) % AVATAR_MESSAGES.length;
    const [gesture, text] = AVATAR_MESSAGES[this.messageIndex];
    this.message.set(text);
    this.gesture = this.reducedMotion ? '' : gesture;
    this.gestureStart = performance.now();

    if (this.reducedMotion) {
      this.renderOnce();
      return;
    }

    cancelAnimationFrame(this.rafId);
    this.rafId = requestAnimationFrame(this.loop);
    this.messageTimerId = window.setTimeout(() => this.playNextMessage(), MESSAGE_INTERVAL_MS);
  }

  private readonly loop = (now: number): void => {
    if (!this.sprite || !this.isOpen()) {
      return;
    }
    const ctx = this.canvasRef.nativeElement.getContext('2d');
    if (ctx) {
      ctx.imageSmoothingEnabled = false;
      renderAvatarFrame(ctx, this.sprite, {
        t: now / 1000,
        gestureTime: (now - this.gestureStart) / 1000,
        gesture: this.gesture,
      });
    }
    this.rafId = requestAnimationFrame(this.loop);
  };

  private renderOnce(): void {
    if (!this.sprite) {
      return;
    }
    const ctx = this.canvasRef.nativeElement.getContext('2d');
    if (ctx) {
      ctx.imageSmoothingEnabled = false;
      renderAvatarFrame(ctx, this.sprite, { t: 0, gestureTime: 0, gesture: '' });
    }
  }
}
