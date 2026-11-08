import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnChanges, Output, SimpleChanges, ViewChild, inject } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { highlightCode } from './simple-highlighter';
import type { ProgrammingLanguageSlug } from '../../../core/models/user.model';

// Used both for the Tab key and for auto-indenting the line after one ending
// in ':' (Python) or '{' (C-like languages).
const INDENT = '    ';

// A plain <textarea> with a syntax-highlighted overlay underneath, instead of
// CodeMirror's contentEditable-based editor. CodeMirror's cursor/line
// handling turned out unreliable on the target Android WebView (cursor
// landing in the wrong place, lines shifting on Enter) — a native textarea
// has OS-level cursor/IME handling that just works, at the cost of writing
// indentation/cursor-insertion logic by hand instead of getting it from the
// library.
@Component({
  selector: 'app-code-editor',
  templateUrl: './code-editor.component.html',
  styleUrls: ['./code-editor.component.scss'],
})
export class CodeEditorComponent implements AfterViewInit, OnChanges {
  @ViewChild('input', { static: true }) private readonly inputRef!: ElementRef<HTMLTextAreaElement>;
  @ViewChild('highlightPre', { static: true }) private readonly preRef!: ElementRef<HTMLPreElement>;

  @Input() value = '';
  @Input() language: ProgrammingLanguageSlug = 'python';
  @Output() readonly valueChange = new EventEmitter<string>();

  highlightedHtml: SafeHtml = '';

  private readonly sanitizer = inject(DomSanitizer);

  ngAfterViewInit(): void {
    const el = this.inputRef.nativeElement;
    el.value = this.value;
    el.setSelectionRange(el.value.length, el.value.length);
    this.render();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!this.inputRef) {
      return;
    }
    if (changes['value'] && this.inputRef.nativeElement.value !== this.value) {
      const el = this.inputRef.nativeElement;
      el.value = this.value;
      el.setSelectionRange(el.value.length, el.value.length);
    }
    if (changes['value'] || changes['language']) {
      this.render();
    }
  }

  // Called from the symbol bar above the editor (PLAN.md Fase 4B: "barra de
  // símbolos sobre el teclado") — mobile keyboards make `{ } [ ] ; : " '`
  // slow to reach, so this inserts at the cursor instead.
  insertAtCursor(text: string): void {
    const el = this.inputRef.nativeElement;
    el.focus();
    const start = el.selectionStart ?? el.value.length;
    const end = el.selectionEnd ?? el.value.length;
    el.setRangeText(text, start, end, 'end');
    this.emitChange();
  }

  onInput(): void {
    this.emitChange();
  }

  onScroll(): void {
    const pre = this.preRef.nativeElement;
    const ta = this.inputRef.nativeElement;
    pre.scrollTop = ta.scrollTop;
    pre.scrollLeft = ta.scrollLeft;
  }

  onKeydown(event: KeyboardEvent): void {
    const el = this.inputRef.nativeElement;

    if (event.key === 'Tab') {
      event.preventDefault();
      el.setRangeText(INDENT, el.selectionStart ?? 0, el.selectionEnd ?? 0, 'end');
      this.emitChange();
      return;
    }

    if (event.key === 'Enter') {
      event.preventDefault();
      const pos = el.selectionStart ?? el.value.length;
      const lineStart = el.value.lastIndexOf('\n', pos - 1) + 1;
      const currentLine = el.value.slice(lineStart, pos);
      const leading = /^[ \t]*/.exec(currentLine)?.[0] ?? '';
      const extra = /[:{]$/.test(currentLine.trim()) ? INDENT : '';
      el.setRangeText('\n' + leading + extra, pos, el.selectionEnd ?? pos, 'end');
      this.emitChange();
    }
  }

  private emitChange(): void {
    const next = this.inputRef.nativeElement.value;
    this.value = next;
    this.render();
    this.valueChange.emit(next);
  }

  private render(): void {
    // Trailing newline keeps the overlay's last line the same height as the
    // textarea's phantom extra line when the code ends in '\n'.
    const html = highlightCode(this.value, this.language) + '\n';
    this.highlightedHtml = this.sanitizer.bypassSecurityTrustHtml(html);
  }
}
