import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { LibraryEntryCreateService } from '../services';
import { LIBRARY_ENTRY_CREATION_PAGES } from '../models';

@Component({
  standalone: true,
  template: `<button class="btn btn-primary" (click)="continue()">
    {{ 'General.Continue' | translate }}
  </button>`,
  host: {
    class: 'd-block w-100 tx-center pd-t-40',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TranslateModule],
})
export class GettingStartedComponent {
  @Input() org!: string;

  constructor(private readonly service: LibraryEntryCreateService) {}

  continue() {
    this.service.nav(this.org, LIBRARY_ENTRY_CREATION_PAGES.BASICS);
  }
}
