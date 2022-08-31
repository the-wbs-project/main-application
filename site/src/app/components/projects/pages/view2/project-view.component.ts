import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { faDownload, faUpload, faX } from '@fortawesome/pro-solid-svg-icons';
import { Navigate } from '@ngxs/router-plugin';
import { Select, Store } from '@ngxs/store';
import {
  ClosedEditor,
  NodeEditorState,
  NodeSelected,
  OpenNodeCreationDialog,
} from '@wbs/components/_features';
import { Project, PROJECT_NODE_VIEW_TYPE } from '@wbs/shared/models';
import { TitleService } from '@wbs/shared/services';
import { UiState } from '@wbs/shared/states';
import { WbsNodeView } from '@wbs/shared/view-models';
import { Observable } from 'rxjs';
import { UserRole } from '../../models';
import { RemoveTask, TreeReordered } from '../../project.actions';
import { ProjectState } from '../../states';
import { PAGE_VIEW, PAGE_VIEW_TYPE } from './models';
import { DownloadNodes, UploadNodes } from './project-view.actions';
import { ProjectViewState } from './project-view.state';

@Component({
  templateUrl: './project-view.component.html',
  styleUrls: ['./project-view.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectView2Component {
  @Select(UiState.mainContentWidth) width$!: Observable<number>;
  @Select(NodeEditorState.node) node$!: Observable<WbsNodeView>;
  @Select(NodeEditorState.show) show$: Observable<boolean> | undefined;
  @Select(ProjectState.roles) roles$!: Observable<UserRole[]>;
  @Select(ProjectState.current) project$!: Observable<Project>;
  @Select(ProjectViewState.viewNode)
  viewNode$!: Observable<PROJECT_NODE_VIEW_TYPE>;
  @Select(ProjectState.disciplines) disciplines$!: Observable<WbsNodeView[]>;
  @Select(ProjectState.phases) phases$!: Observable<WbsNodeView[]>;
  @Select(ProjectViewState.pageView)
  pageView$!: Observable<PAGE_VIEW_TYPE>;

  readonly faDownload = faDownload;
  readonly faUpload = faUpload;
  readonly faX = faX;
  readonly links = [
    {
      fragment: PAGE_VIEW.ABOUT,
      title: 'About',
    },
    {
      fragment: PAGE_VIEW.PHASES,
      title: 'Phases',
    },
    {
      fragment: PAGE_VIEW.DISCIPLINES,
      title: 'Disciplines',
    },
    {
      fragment: PAGE_VIEW.TIMELINE,
      title: 'Timeline',
    },
  ];

  constructor(
    title: TitleService,
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

  nodeSelected(node: WbsNodeView) {
    const activity = this.store.selectSnapshot(ProjectState.activity) ?? [];
    this.store.dispatch(
      new NodeSelected(
        node,
        this.currentNodeView,
        activity.filter((x) => x.objectId === node.id)
      )
    );
  }

  nodeMenuClicked(action: string, node: WbsNodeView) {
    if (action === 'delete') {
      this.store.dispatch(new RemoveTask(node.id));
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

  close() {
    this.store.dispatch(new ClosedEditor());
  }

  reordered([draggedId, rows]: [string, WbsNodeView[]]): void {
    const view = this.store.selectSnapshot(ProjectViewState.viewNode)!;

    this.store.dispatch(new TreeReordered(draggedId, view, rows));
  }
}
