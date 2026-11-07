import {
  Component,
  ElementRef,
  EventEmitter,
  Output,
  ViewChild,
  AfterViewInit,
  OnDestroy,
  NgZone,
  inject,
} from '@angular/core';
import { SplashScreen } from '@capacitor/splash-screen';

type Point = [number, number];

interface Particle {
  tx: number;
  ty: number;
  sx: number;
  sy: number;
  cx: number;
  cy: number;
  dl: number;
  du: number;
  isAccent: boolean;
}

interface ThemeColors {
  fg: string;
  accent: string;
  badge: string;
}

const W = 340;
const H = 190;
const CX = 170;
const CY = 62;
const FONT = '700 29px ui-monospace, Menlo, Consolas, "Courier New", monospace';
const TEXT = 'CodeQuest';
const HEX: Point[] = [
  [170, 18],
  [208, 40],
  [208, 84],
  [170, 106],
  [132, 84],
  [132, 40],
  [170, 18],
];
const GLYPH_LEFT: Point[] = [
  [158, 51],
  [146, 62],
  [158, 73],
];
const GLYPH_RIGHT: Point[] = [
  [182, 51],
  [194, 62],
  [182, 73],
];
const GLYPH_SLASH: Point[] = [
  [175, 47],
  [165, 77],
];

// How long the reveal plays before fading into the real app. Long enough for
// the hex, glyph and "CodeQuest" text to fully resolve plus one shine sweep;
// not the full looping demo from the source file, which was built to repeat
// indefinitely on a standalone page rather than gate a cold start.
const HOLD_MS = 3800;
const FADE_MS = 450;
const REDUCED_MOTION_HOLD_MS = 700;

// Full-screen overlay shown once at cold start (see app.component.html),
// adapted from the standalone animation the logo was designed with. The
// native Android splash (solid color, no logo — see android/.../splash.png)
// hands off to this the instant it mounts, so there's no flash: both start
// from the same dark background and this draws the logo in from nothing.
@Component({
  selector: 'app-boot-screen',
  templateUrl: './boot-screen.component.html',
  styleUrls: ['./boot-screen.component.scss'],
})
export class BootScreenComponent implements AfterViewInit, OnDestroy {
  @ViewChild('canvas', { static: true }) private readonly canvasRef!: ElementRef<HTMLCanvasElement>;
  @Output() readonly done = new EventEmitter<void>();

  private readonly zone = inject(NgZone);
  private readonly hostEl = inject(ElementRef<HTMLElement>);

  private ctx!: CanvasRenderingContext2D;
  private colors: ThemeColors = { fg: '#e8edf2', accent: '#22d3ee', badge: '#11161d' };
  private particles: Particle[] = [];
  private textX0 = 0;
  private textWidth = 0;
  private textCodeWidth = 0;
  private scale = 1;
  private rafId: number | null = null;
  private startTime = 0;
  private fadeTimer: ReturnType<typeof setTimeout> | null = null;
  private doneTimer: ReturnType<typeof setTimeout> | null = null;
  private readonly reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  ngAfterViewInit(): void {
    void SplashScreen.hide();

    const ctx = this.canvasRef.nativeElement.getContext('2d');
    if (!ctx) {
      this.finish();
      return;
    }
    this.ctx = ctx;

    this.readColors();
    this.resize();
    this.buildParticles();

    if (this.reducedMotion) {
      this.drawFrame(5000);
      this.scheduleFinish(REDUCED_MOTION_HOLD_MS);
      return;
    }

    // rAF runs outside Angular's zone so this doesn't trigger change
    // detection on every frame.
    this.zone.runOutsideAngular(() => {
      this.startTime = performance.now();
      this.loop();
    });
    this.scheduleFinish(HOLD_MS);
  }

  ngOnDestroy(): void {
    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
    }
    if (this.fadeTimer) {
      clearTimeout(this.fadeTimer);
    }
    if (this.doneTimer) {
      clearTimeout(this.doneTimer);
    }
  }

  private scheduleFinish(holdMs: number): void {
    this.fadeTimer = setTimeout(() => {
      this.zone.run(() => this.hostEl.nativeElement.classList.add('fading'));
      this.doneTimer = setTimeout(() => this.finish(), FADE_MS);
    }, holdMs);
  }

  private finish(): void {
    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
    this.zone.run(() => this.done.emit());
  }

  private readColors(): void {
    const style = getComputedStyle(document.documentElement);
    this.colors = {
      fg: style.getPropertyValue('--ion-text-color').trim() || this.colors.fg,
      accent: style.getPropertyValue('--ion-color-secondary').trim() || this.colors.accent,
      badge: style.getPropertyValue('--ion-toolbar-background').trim() || this.colors.badge,
    };
  }

  private resize(): void {
    const canvas = this.canvasRef.nativeElement;
    const rect = canvas.getBoundingClientRect();
    const density = Math.min(window.devicePixelRatio || 1, 3);
    canvas.width = Math.max(1, Math.round(rect.width * density));
    canvas.height = Math.round((canvas.width * H) / W);
    this.scale = canvas.width / W;
  }

  private buildParticles(): void {
    const K = 3;
    const offscreen = document.createElement('canvas');
    offscreen.width = W * K;
    offscreen.height = H * K;
    const octx = offscreen.getContext('2d');
    if (!octx) {
      return;
    }
    octx.scale(K, K);
    octx.font = FONT;
    octx.fillStyle = '#fff';
    this.textWidth = octx.measureText(TEXT).width;
    this.textCodeWidth = octx.measureText('Code').width;
    this.textX0 = CX - this.textWidth / 2;
    octx.fillText(TEXT, this.textX0, 150);

    const data = octx.getImageData(0, 0, W * K, H * K).data;
    const particles: Particle[] = [];
    for (let y = 0; y < H * K; y += 3) {
      for (let x = 0; x < W * K; x += 3) {
        if (data[(y * W * K + x) * 4 + 3] <= 128) {
          continue;
        }
        const tx = x / K + (Math.random() - 0.5) * 0.4;
        const ty = y / K + (Math.random() - 0.5) * 0.4;
        const angle = Math.random() * Math.PI * 2;
        const radius = Math.random() * 6;
        const sx = CX + Math.cos(angle) * radius;
        const sy = CY + Math.sin(angle) * radius;
        particles.push({
          tx,
          ty,
          sx,
          sy,
          cx: (sx + tx) / 2 + (Math.random() - 0.5) * 120,
          cy: (sy + ty) / 2 - 20 - Math.random() * 60,
          dl: 1050 + ((tx - this.textX0) / this.textWidth) * 600 + Math.random() * 200,
          du: 900 + Math.random() * 400,
          isAccent: tx >= this.textX0 + this.textCodeWidth,
        });
      }
    }
    this.particles = particles;
  }

  private loop = (): void => {
    this.drawFrame(performance.now() - this.startTime);
    this.rafId = requestAnimationFrame(this.loop);
  };

  private drawFrame(t: number): void {
    const ctx = this.ctx;
    const { fg, accent, badge } = this.colors;
    ctx.setTransform(this.scale, 0, 0, this.scale, 0, 0);
    ctx.clearRect(0, 0, W, H);

    const floatY = Math.sin(Math.max(0, t - 1800) / 1000 * 2.1) * 2.5 * smoothstep(1800, 2600, t);
    const glow = smoothstep(700, 1400, t) * (0.8 + 0.2 * Math.sin(t / 500));

    if (glow > 0) {
      const gradient = ctx.createRadialGradient(CX, CY + floatY, 4, CX, CY + floatY, 58);
      gradient.addColorStop(0, rgba(accent, 0.26 * glow));
      gradient.addColorStop(0.6, rgba(accent, 0.08 * glow));
      gradient.addColorStop(1, rgba(accent, 0));
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, W, H);
    }

    const orbitAlpha = smoothstep(3200, 4000, t);
    if (orbitAlpha > 0) {
      for (let i = 0; i < 10; i++) {
        const angle = t / 2600 + i * 0.6283;
        const sinA = Math.sin(angle);
        ctx.fillStyle = rgba(i % 2 ? fg : accent, orbitAlpha * (0.3 + 0.35 * sinA));
        ctx.beginPath();
        ctx.arc(CX + Math.cos(angle) * 62, CY + floatY + sinA * 40, 1.1 + 0.7 * sinA, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    for (let i = 0; i < 2; i++) {
      const ringProgress = (t - 1000 - i * 160) / 850;
      if (ringProgress > 0 && ringProgress < 1) {
        ctx.strokeStyle = rgba(accent, (1 - ringProgress) * 0.65);
        ctx.lineWidth = 0.6 + (1 - ringProgress) * 2;
        ctx.beginPath();
        ctx.arc(CX, CY, 24 + easeOutCubic(ringProgress) * 36, 0, Math.PI * 2);
        ctx.stroke();
      }
    }

    ctx.save();
    ctx.translate(0, floatY);
    const fillAlpha = smoothstep(300, 900, t);
    if (fillAlpha > 0) {
      hexPath(ctx);
      ctx.globalAlpha = fillAlpha;
      ctx.fillStyle = badge;
      ctx.fill();
      ctx.globalAlpha = 1;
    }
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = fg;
    ctx.lineWidth = 3;
    const hexProgress = clamp(t / 700);
    if (hexProgress > 0) {
      strokePolyline(ctx, HEX, easeOutCubic(hexProgress));
    }
    ctx.shadowColor = accent;
    ctx.shadowBlur = 9 * glow;
    ctx.strokeStyle = accent;
    ctx.lineWidth = 4;
    const bracketProgress = clamp((t - 550) / 450);
    if (bracketProgress > 0) {
      strokePolyline(ctx, GLYPH_LEFT, easeOutCubic(bracketProgress));
      strokePolyline(ctx, GLYPH_RIGHT, easeOutCubic(bracketProgress));
    }
    ctx.strokeStyle = fg;
    const slashProgress = clamp((t - 750) / 450);
    if (slashProgress > 0) {
      strokePolyline(ctx, GLYPH_SLASH, easeOutCubic(slashProgress));
    }
    ctx.shadowBlur = 0;

    const shineProgress = t > 1100 ? ((t - 1100) % 7000) / 900 : 2;
    if (shineProgress < 1) {
      ctx.save();
      hexPath(ctx);
      ctx.clip();
      const beamX = 100 + shineProgress * 130;
      ctx.fillStyle = rgba(fg, 0.28 * Math.sin(shineProgress * Math.PI));
      ctx.beginPath();
      ctx.moveTo(beamX + 30, 10);
      ctx.lineTo(beamX + 46, 10);
      ctx.lineTo(beamX + 16, 115);
      ctx.lineTo(beamX, 115);
      ctx.fill();
      ctx.restore();
    }
    ctx.restore();

    const textAlpha = smoothstep(2800, 3400, t);
    if (textAlpha < 1) {
      for (const particle of this.particles) {
        const u = (t - particle.dl) / particle.du;
        if (u <= 0) {
          continue;
        }
        const clampedU = Math.min(1, u);
        const alpha = Math.min(1, clampedU * 5) * (1 - textAlpha);
        const color = particle.isAccent ? accent : fg;
        const [qx, qy] = bezierPoint(particle, clampedU);
        if (clampedU < 1) {
          const [tailX, tailY] = bezierPoint(particle, Math.max(0, clampedU - 0.07));
          ctx.fillStyle = rgba(color, alpha * 0.35);
          ctx.fillRect(tailX - 0.8, tailY - 0.8, 1.6, 1.6);
        }
        ctx.fillStyle = rgba(color, alpha);
        ctx.fillRect(qx - 0.9, qy - 0.9, 1.8, 1.8);
      }
    }

    if (textAlpha > 0) {
      ctx.font = FONT;
      ctx.textAlign = 'left';
      ctx.globalAlpha = textAlpha;
      ctx.fillStyle = fg;
      ctx.fillText('Code', this.textX0, 150);
      ctx.fillStyle = accent;
      ctx.fillText('Quest', this.textX0 + this.textCodeWidth, 150);

      const sweep = t > 3500 ? ((t - 3500) % 7000) / 900 : 2;
      if (sweep < 1) {
        const beamX = this.textX0 - 30 + sweep * (this.textWidth + 60);
        const gradient = ctx.createLinearGradient(beamX - 24, 0, beamX + 24, 0);
        gradient.addColorStop(0, 'rgba(255,255,255,0)');
        gradient.addColorStop(0.5, 'rgba(255,255,255,.75)');
        gradient.addColorStop(1, 'rgba(255,255,255,0)');
        ctx.fillStyle = gradient;
        ctx.fillText(TEXT, this.textX0, 150);
      }
      ctx.globalAlpha = 1;
    }
  }
}

function clamp(value: number): number {
  return Math.max(0, Math.min(1, value));
}

function smoothstep(a: number, b: number, t: number): number {
  const u = clamp((t - a) / (b - a));
  return u * u * (3 - 2 * u);
}

function easeOutCubic(u: number): number {
  return 1 - Math.pow(1 - u, 3);
}

function easeInOutCubic(u: number): number {
  return u < 0.5 ? 4 * u * u * u : 1 - Math.pow(-2 * u + 2, 3) / 2;
}

function rgba(hex: string, alpha: number): string {
  const n = parseInt(hex.replace('#', ''), 16);
  return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${alpha})`;
}

function hexPath(ctx: CanvasRenderingContext2D): void {
  ctx.beginPath();
  HEX.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)));
  ctx.closePath();
}

function strokePolyline(ctx: CanvasRenderingContext2D, points: Point[], progress: number): void {
  const segmentLengths: number[] = [];
  let total = 0;
  for (let i = 1; i < points.length; i++) {
    const length = Math.hypot(points[i][0] - points[i - 1][0], points[i][1] - points[i - 1][1]);
    segmentLengths.push(length);
    total += length;
  }
  let remaining = progress * total;
  ctx.beginPath();
  ctx.moveTo(points[0][0], points[0][1]);
  for (let i = 1; i < points.length; i++) {
    if (remaining <= 0) {
      break;
    }
    const fraction = Math.min(1, remaining / segmentLengths[i - 1]);
    ctx.lineTo(
      points[i - 1][0] + (points[i][0] - points[i - 1][0]) * fraction,
      points[i - 1][1] + (points[i][1] - points[i - 1][1]) * fraction,
    );
    remaining -= segmentLengths[i - 1];
  }
  ctx.stroke();
}

function bezierPoint(p: Particle, u: number): [number, number] {
  const eased = easeInOutCubic(u);
  const inverse = 1 - eased;
  return [
    inverse * inverse * p.sx + 2 * inverse * eased * p.cx + eased * eased * p.tx,
    inverse * inverse * p.sy + 2 * inverse * eased * p.cy + eased * eased * p.ty,
  ];
}
