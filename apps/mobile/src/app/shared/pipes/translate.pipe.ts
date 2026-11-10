import { Pipe, PipeTransform, inject } from '@angular/core';
import { I18nService } from '../../core/services/i18n.service';

// Impure so it re-evaluates whenever the page's change detection runs, not
// just when the key input itself changes — needed for the translated text
// to actually update the moment I18nService.language() changes.
@Pipe({ name: 'translate', pure: false })
export class TranslatePipe implements PipeTransform {
  private readonly i18n = inject(I18nService);

  transform(key: string): string {
    return this.i18n.t(key);
  }
}
