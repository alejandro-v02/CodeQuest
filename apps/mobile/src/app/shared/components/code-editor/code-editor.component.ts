import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { EditorState } from '@codemirror/state';
import {
  EditorView,
  highlightSpecialChars,
  drawSelection,
  dropCursor,
  rectangularSelection,
  crosshairCursor,
  highlightActiveLine,
  keymap,
} from '@codemirror/view';
import {
  indentOnInput,
  syntaxHighlighting,
  HighlightStyle,
  bracketMatching,
  indentUnit,
} from '@codemirror/language';
import { history, defaultKeymap, historyKeymap, indentWithTab } from '@codemirror/commands';
import { highlightSelectionMatches, searchKeymap } from '@codemirror/search';
import { closeBrackets, closeBracketsKeymap } from '@codemirror/autocomplete';
import { tags } from '@lezer/highlight';
import { python } from '@codemirror/lang-python';
import { javascript } from '@codemirror/lang-javascript';
import { cpp } from '@codemirror/lang-cpp';
import type { LanguageSupport } from '@codemirror/language';
import type { ProgrammingLanguageSlug } from '../../../core/models/user.model';

// `defaultHighlightStyle` is tuned for light backgrounds and reads as nearly
// monochrome against this editor's near-black theme — define our own colors
// instead so keywords, functions, strings, etc. are actually distinguishable.
const CODE_HIGHLIGHT_STYLE = HighlightStyle.define([
  { tag: tags.keyword, color: '#c792ea' },
  { tag: [tags.function(tags.variableName), tags.definitionKeyword], color: 'var(--ion-color-secondary, #22d3ee)' },
  { tag: [tags.string, tags.special(tags.string)], color: '#9ece6a' },
  { tag: [tags.number, tags.bool, tags.null], color: '#f6a95a' },
  { tag: tags.comment, color: '#6b7280', fontStyle: 'italic' },
  { tag: [tags.operator, tags.punctuation], color: 'var(--ion-text-color, #f2f2f2)' },
  { tag: [tags.className, tags.typeName], color: '#f0d26a' },
  { tag: tags.propertyName, color: '#82aaff' },
  { tag: tags.variableName, color: 'var(--ion-text-color, #f2f2f2)' },
]);

// Same as the `codemirror` package's `basicSetup`, minus `lineNumbers()`,
// `foldGutter()` and `autocompletion()` — these exercises are 1-3 lines long,
// and on some Android WebViews both the gutter column and the autocomplete
// popup fail to position/contain themselves inside the fixed-height editor
// box, rendering on top of the rest of the page instead.
const editorSetup = [
  highlightSpecialChars(),
  history(),
  drawSelection(),
  dropCursor(),
  EditorState.allowMultipleSelections.of(true),
  indentUnit.of('    '),
  indentOnInput(),
  syntaxHighlighting(CODE_HIGHLIGHT_STYLE, { fallback: true }),
  bracketMatching(),
  closeBrackets(),
  rectangularSelection(),
  crosshairCursor(),
  highlightActiveLine(),
  highlightSelectionMatches(),
  keymap.of([
    indentWithTab,
    ...closeBracketsKeymap,
    ...defaultKeymap,
    ...searchKeymap,
    ...historyKeymap,
  ]),
];

function languageExtension(slug: ProgrammingLanguageSlug): LanguageSupport {
  switch (slug) {
    case 'python':
      return python();
    case 'typescript':
      return javascript({ typescript: true });
    case 'cpp':
      return cpp();
    case 'javascript':
    default:
      return javascript();
  }
}

// CSS custom properties resolve at paint time, so referencing the app's
// theme tokens here keeps the editor in sync with variables.scss without
// duplicating any colors.
const EDITOR_THEME = EditorView.theme(
  {
    '&': {
      height: '100%',
      fontSize: '14px',
      backgroundColor: 'var(--ion-item-background, #0f0f0f)',
      color: 'var(--ion-text-color, #f2f2f2)',
      borderRadius: '14px',
      border: '1px solid var(--ion-border-color, #262626)',
    },
    '.cm-content': {
      fontFamily: "ui-monospace, Menlo, Consolas, 'Courier New', monospace",
      caretColor: 'var(--ion-color-secondary, #22d3ee)',
      padding: '12px 14px',
      whiteSpace: 'pre-wrap',
    },
    '.cm-cursor': { borderLeftColor: 'var(--ion-color-secondary, #22d3ee)' },
    '.cm-activeLine': { backgroundColor: 'rgba(255, 255, 255, 0.04)' },
    '&.cm-focused': { outline: 'none' },
    '&.cm-focused .cm-selectionBackground, .cm-selectionBackground': {
      backgroundColor: 'rgba(34, 211, 238, 0.18)',
    },
    '.cm-scroller': { overflow: 'auto' },
  },
  { dark: true },
);

@Component({
  selector: 'app-code-editor',
  template: '<div #host class="code-editor-host"></div>',
  styleUrls: ['./code-editor.component.scss'],
})
export class CodeEditorComponent implements AfterViewInit, OnChanges, OnDestroy {
  @ViewChild('host', { static: true }) private readonly hostRef!: ElementRef<HTMLDivElement>;

  @Input() value = '';
  @Input() language: ProgrammingLanguageSlug = 'python';
  @Output() readonly valueChange = new EventEmitter<string>();

  private view: EditorView | null = null;

  // Called from the symbol bar above the editor (PLAN.md Fase 4B: "barra de
  // símbolos sobre el teclado") — mobile keyboards make `{ } [ ] ; : " '`
  // slow to reach, so this inserts at the cursor instead.
  insertAtCursor(text: string): void {
    if (!this.view) {
      return;
    }
    const { from, to } = this.view.state.selection.main;
    this.view.dispatch({
      changes: { from, to, insert: text },
      selection: { anchor: from + text.length },
    });
    this.view.focus();
  }

  ngAfterViewInit(): void {
    this.view = new EditorView({
      parent: this.hostRef.nativeElement,
      state: this.buildState(this.value),
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!this.view) {
      return;
    }
    // Only react to an external value replacement (e.g. loading a different
    // exercise), not to every keystroke echoed back through [value].
    if (changes['value'] && this.view.state.doc.toString() !== this.value) {
      this.view.setState(this.buildState(this.value));
    } else if (changes['language'] && !changes['language'].firstChange) {
      this.view.setState(this.buildState(this.view.state.doc.toString()));
    }
  }

  ngOnDestroy(): void {
    this.view?.destroy();
  }

  private buildState(doc: string): EditorState {
    return EditorState.create({
      doc,
      // Without this, CodeMirror's default cursor sits at position 0, so
      // tapping a symbol-bar button before ever tapping the editor itself
      // inserts at the very start of the starter code instead of the end.
      selection: { anchor: doc.length },
      extensions: [
        editorSetup,
        languageExtension(this.language),
        EDITOR_THEME,
        EditorView.updateListener.of((update) => {
          if (update.docChanged) {
            this.valueChange.emit(update.state.doc.toString());
          }
        }),
      ],
    });
  }
}
