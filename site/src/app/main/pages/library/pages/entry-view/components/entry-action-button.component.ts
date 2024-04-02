import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
} from '@angular/core';
import { ActionButtonComponent } from '@wbs/main/components/action-button';
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
export class EntryActionButtonComponent {
  readonly service = inject(EntryActionButtonService);

  readonly entryType = input.required<string>();
  readonly entryUrl = input.required<string[]>();
  readonly claims = input.required<string[]>();
  readonly menu = computed(() =>
    this.service.buildMenu(this.entryType(), this.entryUrl(), this.claims())
  );
}
