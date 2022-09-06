import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { faDiagramProject } from '@fortawesome/pro-solid-svg-icons';
import { Navigate } from '@ngxs/router-plugin';
import { Select, Store } from '@ngxs/store';
import {
  ClosedEditor,
  NodeEditorState,
  OpenNodeCreationDialog,
} from '@wbs/components/_features';
import {
  ActionMenuItem,
  Project,
  PROJECT_NODE_VIEW_TYPE,
} from '@wbs/shared/models';
import { TitleService } from '@wbs/shared/services';
import { UiState } from '@wbs/shared/states';
import { WbsNodeView } from '@wbs/shared/view-models';
import { BehaviorSubject, Observable } from 'rxjs';
import { UserRole } from '../../models';
import { CreateTask, RemoveTask, TreeReordered } from '../../project.actions';
import { ProjectState } from '../../states';
import { MenuItems, PAGE_VIEW_TYPE } from './models';
import {
  DownloadNodes,
  EditDisciplines,
  EditPhases,
  UploadNodes,
} from './project-view.actions';
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
  @Select(ProjectState.disciplines) disciplines$!: Observable<WbsNodeView[]>;
  @Select(ProjectState.phases) phases$!: Observable<WbsNodeView[]>;
  @Select(ProjectViewState.pageView) pageView$!: Observable<PAGE_VIEW_TYPE>;
  @Select(ProjectViewState.viewNode)
  viewNode$!: Observable<PROJECT_NODE_VIEW_TYPE>;

  private task?: WbsNodeView;

  readonly phaseMenuItems$ = new BehaviorSubject<ActionMenuItem[][]>([
    MenuItems.phaseTreeActions,
  ]);
  readonly disciplineMenuItems$ = new BehaviorSubject<ActionMenuItem[][]>([]);
  readonly faProject = faDiagramProject;
  readonly links = MenuItems.projectLinks;
  readonly actions = MenuItems.phaseActions;

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

  taskSelected(task: WbsNodeView) {
    this.task = task;

    const menu: ActionMenuItem[] = [];

    for (const item of MenuItems.phaseItemActions) {
      if (item.action === 'addSub' || task.parentId != null) menu.push(item);
    }

    this.phaseMenuItems$.next([MenuItems.phaseTreeActions, menu]);
  }

  action(action: string) {
    if (action === 'download') {
      this.store.dispatch(new DownloadNodes());
    } else if (action === 'upload') {
      this.store.dispatch(new UploadNodes());
    } else if (action === 'editPhases') {
      this.store.dispatch(new EditPhases());
    } else if (action === 'editDisciplines') {
      this.store.dispatch(new EditDisciplines());
    } else if (action === 'addSub' && this.task) {
      this.store.dispatch(new CreateTask(this.task.id));
    } else if (action === 'editTask') {
      //
    } else if (action === 'cloneTask') {
      //
    } else if (action === 'deleteTask' && this.task) {
      this.store.dispatch(new RemoveTask(this.task.id));
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
