import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Output,
  ViewEncapsulation,
} from '@angular/core';
import {
  faEllipsisVertical,
  faPlus,
  faTrashCan,
} from '@fortawesome/pro-solid-svg-icons';
import { Select } from '@ngxs/store';
import { Observable } from 'rxjs';
import { EditorView, MenuItem } from '../models';
import { NodeEditorState } from '../state';

@Component({
  selector: 'wbs-node-actions-menu',
  template: `<kendo-dropdownbutton
    [data]="menu"
    textField="label"
    valueField="action"
    size="small"
    fillMode="flat"
    [ngClass]="'editor-header-dd-button'"
    [popupSettings]="{ align: 'right' }"
    (itemClick)="menuClicked.emit($event.action)"
  >
    <fa-icon [icon]="faEllipsisVertical"> </fa-icon>
    <ng-template kendoDropDownButtonItemTemplate let-dataItem>
      <fa-icon [icon]="dataItem.icon"> </fa-icon>
      {{ dataItem.label | translate }}
    </ng-template>
  </kendo-dropdownbutton>`,
  styleUrls: ['./editor-header-items.scss'],

  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class ActionsMenuComponent {
  @Select(NodeEditorState.viewLabel) viewLabel$!: Observable<string>;
  @Select(NodeEditorState.views) views$!: Observable<EditorView[]>;
  @Output() readonly menuClicked = new EventEmitter<string>();

  readonly faEllipsisVertical = faEllipsisVertical;
  readonly menu: MenuItem[] = [
    {
      action: 'add',
      icon: faPlus,
      label: 'Wbs.AddSubTask',
    },
    {
      action: 'delete',
      icon: faTrashCan,
      label: 'Wbs.DeleteTask',
    },
  ];
}
