import { Component, computed, input } from '@angular/core';
import { LANGUAGE_BRANDS, type ProgrammingLanguageSlug } from '../../../core/models/user.model';

// Monogram "logo" badge for a language — no external image assets, just a
// colored gradient square with the language's initials, so every language
// gets a recognizable accent without needing real brand artwork.
@Component({
  selector: 'app-language-badge',
  templateUrl: './language-badge.component.html',
  styleUrls: ['./language-badge.component.scss'],
})
export class LanguageBadgeComponent {
  readonly languageSlug = input.required<ProgrammingLanguageSlug>();

  readonly brand = computed(() => LANGUAGE_BRANDS[this.languageSlug()]);
}
