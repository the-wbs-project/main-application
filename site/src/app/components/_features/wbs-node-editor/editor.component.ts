import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Output,
  ViewEncapsulation,
} from '@angular/core';
import {
  faAngleDown,
  faArrowUpFromSquare,
  faEllipsisVertical,
  faPencil,
  faTrashCan,
} from '@fortawesome/pro-solid-svg-icons';
import { Select, Store } from '@ngxs/store';
import { Activity, ListItem, WbsNodeView } from '@wbs/models';
import { Resources } from '@wbs/services';
import { Observable } from 'rxjs';
import { EditorViewChanged } from './actions';
import { EditorView } from './models';
import { NodeEditorState } from './state';

@Component({
  selector: 'wbs-node-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss'],
  preserveWhitespaces: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class WbsNodeEditorComponent {
  @Select(NodeEditorState.history) history$!: Observable<Activity[]>;
  @Select(NodeEditorState.node) node$!: Observable<WbsNodeView>;
  @Select(NodeEditorState.view) view$!: Observable<string>;
  @Select(NodeEditorState.views) views$!: Observable<EditorView[]>;
  @Output() readonly nodeDeleted = new EventEmitter<string>();

  readonly faAngleDown = faAngleDown;
  readonly faArrowUpFromSquare = faArrowUpFromSquare;
  readonly faEllipsisVertical = faEllipsisVertical;
  readonly faPencil = faPencil;
  readonly faTrashCan = faTrashCan;
  dOpen = false;
  dReason: ListItem | undefined;
  dOther = '';

  constructor(
    private readonly resources: Resources,
    private readonly store: Store
  ) {}

  sectionChanged(view: EditorView) {
    console.log(view);
    this.store.dispatch(new EditorViewChanged(view));
  }

  async menuClicked(action: 'delete') {
    if (action === 'delete') {
      this.dOpen = true;
    }
  }

  closeDelete() {
    this.dOpen = false;
  }

  finishDelete() {
    if (this.dReason)
      if (this.dReason.id === 'delete-other') {
        this.nodeDeleted.emit(this.dOther.trim());
      } else {
        this.nodeDeleted.emit(this.resources.get(this.dReason.label));
      }
    this.dOpen = false;
  }
}
