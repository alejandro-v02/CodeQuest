import { Component, input } from '@angular/core';
import type { ProgrammingLanguageSlug } from '../../../core/models/user.model';

// Renders the real brand logo for a language — no stand-in monogram.
@Component({
  selector: 'app-language-badge',
  templateUrl: './language-badge.component.html',
  styleUrls: ['./language-badge.component.scss'],
})
export class LanguageBadgeComponent {
  readonly languageSlug = input.required<ProgrammingLanguageSlug>();
}
