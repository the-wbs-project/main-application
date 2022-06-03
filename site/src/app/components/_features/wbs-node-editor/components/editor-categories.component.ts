import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from '@angular/core';
import { faAngleDown } from '@fortawesome/pro-solid-svg-icons';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { EditorViewChanged } from '../actions';
import { EditorView } from '../models';
import { NodeEditorState } from '../state';

@Component({
  selector: 'wbs-node-editor-categories',
  template: `<kendo-dropdownbutton
    [data]="views$ | async"
    textField="label"
    valueField="id"
    size="small"
    fillMode="flat"
    [ngClass]="'editor-header-dd-button'"
    (itemClick)="sectionChanged($event)"
  >
    {{ (viewLabel$ | async) ?? '' | translate }}&nbsp;
    <fa-icon [icon]="faAngleDown"></fa-icon>

    <ng-template kendoDropDownButtonItemTemplate let-dataItem>
      {{ dataItem.label | translate }}
    </ng-template>
  </kendo-dropdownbutton>`,
  styleUrls: ['./editor-header-items.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class EditorCategoriesComponent {
  @Select(NodeEditorState.viewLabel) viewLabel$!: Observable<string>;
  @Select(NodeEditorState.views) views$!: Observable<EditorView[]>;

  readonly faAngleDown = faAngleDown;

  constructor(private readonly store: Store) {}

  sectionChanged(view: EditorView) {
    this.store.dispatch(new EditorViewChanged(view));
  }
}
