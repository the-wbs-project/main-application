import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
} from '@angular/core';
import { EntryActionButtonService } from '../services';
import { ActionButtonComponent2 } from '@wbs/components/action-button2';

@Component({
  standalone: true,
  selector: 'wbs-entry-action-button',
  template: `<wbs-action-button
    [menu]="menu()"
    (itemClicked)="service.handleAction($event)"
  />`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ActionButtonComponent2],
  providers: [EntryActionButtonService],
})
export class EntryActionButtonComponent {
  readonly service = inject(EntryActionButtonService);

  readonly entryType = input.required<string>();
  readonly versionStatus = input.required<string>();
  readonly entryUrl = input.required<string[]>();
  readonly claims = input.required<string[]>();
  readonly menu = computed(() =>
    this.service.buildMenu(
      this.entryType(),
      this.versionStatus(),
      this.entryUrl(),
      this.claims()
    )
  );
}
