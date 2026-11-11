import { Component, input } from '@angular/core';
import type { ProgrammingLanguageSlug } from '../../../core/models/user.model';

// SVG gradient ids are document-global: with a fixed id, every badge after the
// first (e.g. one on a hidden tab page) resolves its fill to the first one in
// the DOM, which renders nothing while that page is display:none. So each
// badge instance gets its own ids.
let nextBadgeId = 0;

// Renders the real brand logo for a language — no stand-in monogram.
@Component({
  selector: 'app-language-badge',
  templateUrl: './language-badge.component.html',
  styleUrls: ['./language-badge.component.scss'],
})
export class LanguageBadgeComponent {
  readonly languageSlug = input.required<ProgrammingLanguageSlug>();
  readonly uid = `lb-${nextBadgeId++}`;
}
