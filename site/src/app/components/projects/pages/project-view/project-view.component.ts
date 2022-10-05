import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Navigate } from '@ngxs/router-plugin';
import { Select, Store } from '@ngxs/store';
import { Project, PROJECT_NODE_VIEW_TYPE } from '@wbs/shared/models';
import { TitleService } from '@wbs/shared/services';
import { UiState } from '@wbs/shared/states';
import { TimelineViewModel, WbsNodeView } from '@wbs/shared/view-models';
import { Observable } from 'rxjs';
import { UserRole } from '../../models';
import {
  ChangeProjectTitle,
  CloneTask,
  CreateTask,
  MoveTaskDown,
  MoveTaskLeft,
  MoveTaskRight,
  MoveTaskUp,
  RemoveTask,
  TreeReordered,
} from '../../actions';
import { ProjectState } from '../../states';
import { MenuItems, PAGE_VIEW_TYPE } from './models';
import {
  DownloadNodes,
  EditDisciplines,
  EditPhases,
  UploadNodes,
} from './project-view.actions';
import { ProjectViewState } from './project-view.state';
import { ProjectTimelineState } from '../../states/project-timeline.state';

@Component({
  templateUrl: './project-view.component.html',
  styleUrls: ['./project-view.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectView2Component implements OnInit {
  @Select(UiState.mainContentWidth) width$!: Observable<number>;
  @Select(ProjectState.roles) roles$!: Observable<UserRole[]>;
  @Select(ProjectState.current) project$!: Observable<Project>;
  @Select(ProjectState.disciplines) disciplines$!: Observable<WbsNodeView[]>;
  @Select(ProjectState.phases) phases$!: Observable<WbsNodeView[]>;
  @Select(ProjectTimelineState.project) timeline$!: Observable<
    TimelineViewModel[]
  >;
  @Select(ProjectViewState.pageView) pageView$!: Observable<PAGE_VIEW_TYPE>;
  @Select(ProjectViewState.viewNode)
  viewNode$!: Observable<PROJECT_NODE_VIEW_TYPE>;
  taskId?: string;
  readonly links = MenuItems.projectLinks;
  readonly actions = MenuItems.phaseActions;

  constructor(
    title: TitleService,
    private readonly route: ActivatedRoute,
    private readonly store: Store
  ) {
    title.setTitle('Project', false);
  }

  private get projectId(): string {
    return this.route.snapshot.params['projectId'];
  }

  ngOnInit(): void {
    //
  }

  viewChanged(view: string): void {
    this.store.dispatch(
      new Navigate(['projects', 'view', this.projectId, view])
    );
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
    } else if (action === 'editTask') {
      //
    } else if (this.taskId) {
      if (action === 'addSub') {
        this.store.dispatch(new CreateTask(this.taskId));
      } else if (action === 'cloneTask') {
        this.store.dispatch(new CloneTask(this.taskId));
      } else if (action === 'deleteTask') {
        this.store.dispatch(new RemoveTask(this.taskId));
      } else if (action === 'moveLeft') {
        this.store.dispatch(new MoveTaskLeft(this.taskId));
      } else if (action === 'moveRight') {
        this.store.dispatch(new MoveTaskRight(this.taskId));
      } else if (action === 'moveUp') {
        this.store.dispatch(new MoveTaskUp(this.taskId));
      } else if (action === 'moveDown') {
        this.store.dispatch(new MoveTaskDown(this.taskId));
      }
    }
  }

  saveTitle(newTitle: string): void {
    this.store.dispatch(new ChangeProjectTitle(newTitle));
  }

  reordered([draggedId, rows]: [string, WbsNodeView[]]): void {
    const view = this.store.selectSnapshot(ProjectViewState.viewNode)!;

    this.store.dispatch(new TreeReordered(draggedId, view, rows));
  }
}
