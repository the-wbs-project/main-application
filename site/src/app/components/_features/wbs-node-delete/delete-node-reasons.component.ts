import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  ViewEncapsulation,
} from '@angular/core';
import { ListItem } from '@wbs/shared/models';

@Component({
  selector: 'wbs-node-delete-reasons',
  template: `<kendo-dropdownlist
    [data]="reasons ?? []"
    textField="label"
    valueField="id"
    [value]="value"
    (valueChange)="set($event)"
  >
    <ng-template
      kendoDropDownListItemTemplate
      kendoDropDownListValueTemplate
      let-dataItem
    >
      {{ dataItem?.label | translate }}
    </ng-template>
  </kendo-dropdownlist>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class DeleteNodeReasonsComponent {
  @Input() value: ListItem | undefined;
  @Input() reasons: ListItem[] | null | undefined;
  @Output() readonly valueChange = new EventEmitter<ListItem>();

  set(value: ListItem) {
    this.value = value;
    this.valueChange.emit(value);
  }
}
