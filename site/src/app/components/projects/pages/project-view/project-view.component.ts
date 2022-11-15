import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Navigate } from '@ngxs/router-plugin';
import { Select, Store } from '@ngxs/store';
import { TaskDeleteService } from '@wbs/components/_features/task-delete';
import { TaskCreateService } from '@wbs/components/_features/task-create';
import {
  Project,
  PROJECT_NODE_VIEW_TYPE,
  TimelineMenuItem,
} from '@wbs/core/models';
import { TitleService } from '@wbs/core/services';
import { UiState } from '@wbs/core/states';
import { TimelineViewModel, WbsNodeView } from '@wbs/core/view-models';
import { Observable } from 'rxjs';
import {
  ChangeProjectTitle,
  CloneTask,
  CreateTask,
  LoadNextProjectTimelinePage,
  MoveTaskDown,
  MoveTaskLeft,
  MoveTaskRight,
  MoveTaskUp,
  RemoveTask,
  RestoreProject,
  TreeReordered,
} from '../../actions';
import { ProjectState, ProjectTimelineState } from '../../states';
import { MenuItems, PAGE_VIEW_TYPE } from './models';
import {
  DownloadNodes,
  EditDisciplines,
  EditPhases,
} from './project-view.actions';
import { ProjectViewState } from './project-view.state';

@Component({
  templateUrl: './project-view.component.html',
  styleUrls: ['./project-view.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectViewComponent {
  @Select(UiState.mainContentWidth) width$!: Observable<number>;
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
    private readonly store: Store,
    private readonly taskCreate: TaskCreateService,
    private readonly taskDelete: TaskDeleteService
  ) {
    title.setTitle('Project', false);
  }

  private get projectId(): string {
    return this.route.snapshot.params['projectId'];
  }

  action(action: string) {
    if (action === 'download') {
      this.store.dispatch(new DownloadNodes());
    } else if (action === 'upload') {
      this.store.dispatch(new Navigate(['projects', this.projectId, 'upload']));
    } else if (action === 'editPhases') {
      this.store.dispatch(new EditPhases());
    } else if (action === 'editDisciplines') {
      this.store.dispatch(new EditDisciplines());
    } else if (action === 'editTask') {
      //
    } else if (this.taskId) {
      if (action === 'addSub') {
        this.taskCreate.open().subscribe((results) => {
          if (results?.model)
            this.store.dispatch(
              new CreateTask(this.taskId!, results.model, results.nav)
            );
        });
      } else if (action === 'cloneTask') {
        this.store.dispatch(new CloneTask(this.taskId));
      } else if (action === 'deleteTask') {
        this.taskDelete.open().subscribe((reason) => {
          if (reason) this.store.dispatch(new RemoveTask(this.taskId!, reason));
        });
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

  loadMoreTimeline() {
    this.store.dispatch(new LoadNextProjectTimelinePage());
  }

  timelineAction(item: TimelineMenuItem) {
    console.log(item.action);
    if (item.action === 'navigate') {
      this.store.dispatch(
        new Navigate(['projects', this.projectId, 'task', item.objectId])
      );
    } else if (item.action === 'restore') {
      this.store.dispatch(new RestoreProject(item.activityId));
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
