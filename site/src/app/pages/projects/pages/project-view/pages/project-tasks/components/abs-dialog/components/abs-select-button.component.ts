import { ChangeDetectionStrategy, Component, output } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { ActionButtonComponent } from '@wbs/components/action-button';

@Component({
  standalone: true,
  selector: 'wbs-abs-select-button',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ActionButtonComponent, TranslateModule],
  template: `<wbs-action-button
    [menu]="menu"
    [customContent]="true"
    (itemClicked)="onItemClicked($event)"
  >
    Select...
  </wbs-action-button>`,
})
export class AbsSelectButtonComponent {
  readonly menu = [
    {
      resource: 'Wbs.WbsSelect1',
      action: '1',
    },
    {
      resource: 'Wbs.WbsSelect2',
      action: '2',
    },
    {
      resource: 'Wbs.WbsSelect3',
      action: '3',
    },
  ];
  readonly selected = output<number>();

  protected onItemClicked(event: string) {
    this.selected.emit(parseInt(event, 10));
  }
}
