import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { faDownload, faUpload } from '@fortawesome/pro-solid-svg-icons';
import { Navigate } from '@ngxs/router-plugin';
import { Select, Store } from '@ngxs/store';
import {
  Project,
  PROJECT_NODE_VIEW_TYPE,
  PROJECT_VIEW_TYPE,
  WbsDisciplineNode,
  WbsNodeView,
  WbsPhaseNode,
} from '@wbs/shared/models';
import { TitleService } from '@wbs/shared/services';
import { Observable, of, tap } from 'rxjs';
import {
  NodeEditorState,
  NodeSelected,
  OpenNodeCreationDialog,
  WbsNodeDeleteService,
} from '../../../_features';
import {
  DownloadNodes,
  ProjectNodeViewChanged,
  RemoveNodeToProject,
  UploadNodes,
} from '../../actions';
import { ProjectState } from '../../states';

@Component({
  templateUrl: './component.html',
  styleUrls: ['./component.scss'],

  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectsViewComponent {
  @Select(NodeEditorState.node) node$!: Observable<WbsNodeView>;
  @Select(NodeEditorState.show) show$: Observable<boolean> | undefined;
  @Select(ProjectState.current) project$!: Observable<Project>;
  @Select(ProjectState.viewNode) viewNode$!: Observable<PROJECT_NODE_VIEW_TYPE>;
  @Select(ProjectState.viewProject)
  viewProject$!: Observable<PROJECT_VIEW_TYPE>;

  @Select(ProjectState.disciplineNodes)
  disciplineNodes$!: Observable<WbsDisciplineNode[]>;

  @Select(ProjectState.phaseNodes)
  phaseNodes$!: Observable<WbsPhaseNode[]>;

  readonly faDownload = faDownload;
  readonly faUpload = faUpload;

  constructor(
    title: TitleService,
    private readonly deleteService: WbsNodeDeleteService,
    private readonly route: ActivatedRoute,
    private readonly store: Store
  ) {
    title.setTitle('Project', false);
  }

  private get currentView(): PROJECT_NODE_VIEW_TYPE {
    return this.route.snapshot.params['view'];
  }

  private get currentNodeView(): PROJECT_NODE_VIEW_TYPE {
    return this.route.snapshot.params['nodeView'];
  }

  private get projectId(): string {
    return this.route.snapshot.params['projectId'];
  }

  viewChanged(view: string): void {
    this.store.dispatch(
      new Navigate(['projects', 'view', this.projectId, view])
    );
  }

  nodeViewChanged(nodeView: string): void {
    this.store.dispatch(
      new ProjectNodeViewChanged(<PROJECT_NODE_VIEW_TYPE>nodeView)
    );
  }

  nodeSelected(project: Project, node: WbsNodeView) {
    this.store.dispatch(
      new NodeSelected(
        node,
        this.currentNodeView,
        project.activity?.filter((x) => x.wbsId === node.id)
      )
    );
  }

  nodeMenuClicked(action: string, node: WbsNodeView) {
    if (action === 'delete') {
      const reasons = this.store.selectSnapshot(ProjectState.deleteReasons)!;

      this.deleteService
        .launchAsync(reasons)
        .pipe(
          tap((reason) =>
            reason
              ? this.store.dispatch(new RemoveNodeToProject(node.id, reason))
              : of()
          )
        )
        .subscribe();
    } else if (action === 'add') {
      this.store.dispatch(new OpenNodeCreationDialog(node, this.currentView));
    }
  }

  action(action: string) {
    if (action === 'download') {
      this.store.dispatch(new DownloadNodes());
    } else if (action === 'upload') {
      this.store.dispatch(new UploadNodes());
    }
  }
}
