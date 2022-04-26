import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Navigate } from '@ngxs/router-plugin';
import { Select, Store } from '@ngxs/store';
import {
  Project,
  PROJECT_VIEW_TYPE,
  WbsNodeView,
  WbsPhaseNode,
} from '@wbs/models';
import { Messages, TitleService } from '@wbs/services';
import { map, Observable } from 'rxjs';
import {
  ClearEditor,
  NodeEditorState,
  NodeSelected,
  OpenNodeCreationDialog,
} from '../../_features';

@Component({
  templateUrl: './component.html',
  styleUrls: ['./component.scss'],
  preserveWhitespaces: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DragAndDropComponent {
  @Select(NodeEditorState.node) node$!: Observable<WbsNodeView>;
  @Select(NodeEditorState.show) show$: Observable<boolean> | undefined;

  showDeleteDialog = false;
  private node: string | undefined;
  readonly nodes$: Observable<WbsPhaseNode[] | null>;
  readonly project$: Observable<Project>;
  readonly view$: Observable<string | null>;

  constructor(
    title: TitleService,
    private readonly route: ActivatedRoute,
    private readonly messages: Messages,
    private readonly store: Store
  ) {
    title.setTitle('Drag and Drop Demo', false);

    this.view$ = this.route.params.pipe(map((p) => p['view']));
    this.nodes$ = this.route.data.pipe(map((d) => d['pageData']!['nodes']));
    this.project$ = this.route.data.pipe(map((d) => d['pageData']!['project']));
  }

  private get currentView(): PROJECT_VIEW_TYPE {
    return this.route.snapshot.params['view'];
  }

  private get projectId(): string {
    return this.route.snapshot.params['projectId'];
  }

  viewChanged(view: string): void {
    this.node = undefined;

    this.store.dispatch([
      new ClearEditor(),
      new Navigate(['demos', 'drag-and-drop', this.projectId, view]),
    ]);
  }

  nodeSelected(project: Project, node: WbsNodeView) {
    this.node = node.id;

    this.store.dispatch(
      new NodeSelected(
        node,
        this.currentView,
        project.activity?.filter((x) => x.wbsId === node.id)
      )
    );
  }

  menuClicked(action: string) {
    console.log(action);
    if (action === 'delete') {
      this.showDeleteDialog = true;
    } else if (action === 'add') {
      this.store.dispatch(
        new OpenNodeCreationDialog(
          this.store.selectSnapshot(NodeEditorState.node)!,
          this.currentView
        )
      );
    }
  }

  nodeDeleted(reason: string | null) {
    this.showDeleteDialog = false;

    if (reason) {
      this.messages.success(reason);
    }
  }
}
