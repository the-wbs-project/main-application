import { Injectable } from '@angular/core';
import { Navigate } from '@ngxs/router-plugin';
import { Store } from '@ngxs/store';
import { TaskCreateService } from '@wbs/components/_features/task-create';
import { TaskDeleteService } from '@wbs/components/_features/task-delete';
import { TimelineMenuItem } from '@wbs/core/models';
import { WbsNodeView } from '@wbs/core/view-models';
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
} from '../../../actions';
import { ProjectState } from '../../../states';
import { DownloadNodes, EditDisciplines, EditPhases } from '../actions';
import { ProjectViewState } from '../states';

@Injectable()
export class ProjectViewService {
  constructor(
    private readonly store: Store,
    private readonly taskCreate: TaskCreateService,
    private readonly taskDelete: TaskDeleteService
  ) {}

  private get projectId(): string {
    return this.store.selectSnapshot(ProjectState.current)!.id;
  }

  private get nodeView(): string {
    return this.store.selectSnapshot(ProjectViewState.viewNode)!;
  }

  saveTitle(newTitle: string): void {
    this.store.dispatch(new ChangeProjectTitle(newTitle));
  }

  action(action: string, taskId?: string) {
    if (action === 'download') {
      this.store.dispatch(new DownloadNodes());
    } else if (action === 'upload') {
      this.store.dispatch(new Navigate(['projects', this.projectId, 'upload']));
    } else if (action === 'editPhases') {
      this.store.dispatch(new EditPhases());
    } else if (action === 'editDisciplines') {
      this.store.dispatch(new EditDisciplines());
    } else if (taskId) {
      if (action === 'addSub') {
        this.taskCreate.open().subscribe((results) => {
          if (results?.model)
            this.store.dispatch(
              new CreateTask(taskId, results.model, results.nav)
            );
        });
      } else if (action === 'cloneTask') {
        this.store.dispatch(new CloneTask(taskId));
      } else if (action === 'viewTask') {
        this.store.dispatch(
          new Navigate([
            'projects',
            this.projectId,
            'view',
            this.nodeView == 'phase' ? 'phases' : 'disciplines',
            'task',
            taskId,
            'about',
          ])
        );
      } else if (action === 'deleteTask') {
        this.taskDelete.open().subscribe((reason) => {
          if (reason) this.store.dispatch(new RemoveTask(taskId!, reason));
        });
      } else if (action === 'moveLeft') {
        this.store.dispatch(new MoveTaskLeft(taskId));
      } else if (action === 'moveRight') {
        this.store.dispatch(new MoveTaskRight(taskId));
      } else if (action === 'moveUp') {
        this.store.dispatch(new MoveTaskUp(taskId));
      } else if (action === 'moveDown') {
        this.store.dispatch(new MoveTaskDown(taskId));
      }
    }
  }

  reordered([draggedId, rows]: [string, WbsNodeView[]]): void {
    const view = this.store.selectSnapshot(ProjectViewState.viewNode)!;

    this.store.dispatch(new TreeReordered(draggedId, view, rows));
  }

  loadMoreTimeline() {
    this.store.dispatch(new LoadNextProjectTimelinePage());
  }

  timelineAction(item: TimelineMenuItem, projectId: string) {
    if (item.action === 'navigate') {
      this.store.dispatch(
        new Navigate(['projects', projectId, 'task', item.objectId])
      );
    } else if (item.action === 'restore') {
      this.store.dispatch(new RestoreProject(item.activityId));
    }
  }
}
