import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from '@angular/core';
import { faAngleDown } from '@fortawesome/pro-solid-svg-icons';
import { Select } from '@ngxs/store';
import { WbsNodeView } from '@wbs/models';
import { Observable } from 'rxjs';
import { EditorView } from '../models';
import { NodeEditorState } from '../states';

@Component({
  selector: 'wbs-node-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss'],
  preserveWhitespaces: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class WbsNodeEditorComponent {
  @Select(NodeEditorState.node) node$: Observable<WbsNodeView> | undefined;
  @Select(NodeEditorState.view) view$: Observable<string> | undefined;
  @Select(NodeEditorState.viewLabel) viewLabel$: Observable<string> | undefined;
  @Select(NodeEditorState.views) views$: Observable<EditorView[]> | undefined;

  readonly faAngleDown = faAngleDown;
}
