import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  ViewEncapsulation,
} from '@angular/core';
import { Select } from '@ngxs/store';
import { ListItem } from '@wbs/models';
import { Observable } from 'rxjs';
import { NodeEditorState } from '../state';

@Component({
  selector: 'wbs-node-delete-reasons',
  template: `<kendo-dropdownlist
    [data]="deleteList$ | async"
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
      {{ dataItem.label | translate }}
    </ng-template>
  </kendo-dropdownlist>`,
  preserveWhitespaces: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class DeleteNodeReasonsComponent {
  @Select(NodeEditorState.deleteList) deleteList$!: Observable<ListItem[]>;
  @Input() value: ListItem | undefined;
  @Output() readonly valueChange = new EventEmitter<ListItem>();

  set(value: ListItem) {
    this.value = value;
    this.valueChange.emit(value);
  }
}
