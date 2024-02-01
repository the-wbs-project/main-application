import {
  ChangeDetectionStrategy,
  Component,
  OnChanges,
  input,
  signal,
} from '@angular/core';
import { LibraryEntry, LibraryEntryVersion } from '@wbs/core/models';
import { ActionButtonComponent } from '@wbs/main/components/action-button';
import { ActionButtonMenuItem } from '@wbs/main/models';
import { EntryActionButtonService } from '../services';

@Component({
  standalone: true,
  selector: 'wbs-entry-action-button',
  template: `<wbs-action-button
    [menu]="menu()"
    (itemClicked)="service.handleAction($event)"
  />`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ActionButtonComponent],
  providers: [EntryActionButtonService],
})
export class EntryActionButtonComponent implements OnChanges {
  readonly claims = input.required<string[]>();
  readonly entry = input.required<LibraryEntry | undefined>();
  readonly version = input.required<LibraryEntryVersion | undefined>();
  readonly menu = signal<ActionButtonMenuItem[] | undefined>(undefined);

  show = false;

  constructor(readonly service: EntryActionButtonService) {}

  ngOnChanges(): void {
    const entry = this.entry();
    const claims = this.claims();
    const version = this.version();

    if (entry && claims && version) {
      this.menu.set(this.service.buildMenu(entry, version, claims));
    }
  }
}
