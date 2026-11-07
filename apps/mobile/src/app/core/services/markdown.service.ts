import { Injectable, inject } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import type { SafeHtml } from '@angular/platform-browser';
import { marked } from 'marked';
import DOMPurify from 'dompurify';

// PLAN.md section 6: "Sanitizar el Markdown renderizado en la app" — lesson
// content comes from our own seed/AI pipeline today, but exercises will be
// AI-generated from Fase 5B onward, so this never trusts the markdown as-is.
@Injectable({ providedIn: 'root' })
export class MarkdownService {
  private readonly sanitizer = inject(DomSanitizer);

  render(markdown: string): SafeHtml {
    const rawHtml = marked.parse(markdown, { async: false }) as string;
    const cleanHtml = DOMPurify.sanitize(rawHtml);
    return this.sanitizer.bypassSecurityTrustHtml(cleanHtml);
  }
}
