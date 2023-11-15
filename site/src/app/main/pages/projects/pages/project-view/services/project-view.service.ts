import { Injectable } from '@angular/core';
import { Store } from '@ngxs/store';
import { DataServiceFactory } from '@wbs/core/data-services';
import {
  PROJECT_NODE_VIEW,
  PROJECT_NODE_VIEW_TYPE,
  ProjectCategory,
} from '@wbs/core/models';
import { Messages } from '@wbs/core/services';
import { WbsNodeView } from '@wbs/core/view-models';
import { TaskCreateService } from '@wbs/main/components/task-create';
import { TaskDeleteService } from '@wbs/main/components/task-delete';
import { Observable } from 'rxjs';
import {
  CloneTask,
  CreateTask,
  MoveTaskDown,
  MoveTaskLeft,
  MoveTaskRight,
  MoveTaskUp,
  RemoveTask,
  TreeReordered,
} from '../actions';
import { PROJECT_PAGES } from '../models';
import { ProjectState, TasksState } from '../states';
import { ProjectNavigationService } from './project-navigation.service';

@Injectable()
export class ProjectViewService {
  constructor(
    private readonly data: DataServiceFactory,
    private readonly messages: Messages,
    private readonly nav: ProjectNavigationService,
    private readonly store: Store,
    private readonly taskCreate: TaskCreateService,
    private readonly taskDelete: TaskDeleteService
  ) {}

  private get projectId(): string {
    return this.store.selectSnapshot(ProjectState.current)!.id;
  }

  private get projectDisciplines(): ProjectCategory[] {
    return this.store.selectSnapshot(ProjectState.current)!.disciplines ?? [];
  }

  action(action: string, taskId?: string) {
    if (action === 'upload') {
      this.nav.toProject(this.projectId, PROJECT_PAGES.UPLOAD);
    } else if (taskId) {
      if (action === 'addSub') {
        this.taskCreate.open(this.projectDisciplines).subscribe((results) => {
          if (results?.model)
            this.store.dispatch(
              new CreateTask(taskId, results.model, results.nav)
            );
        });
      } else if (action === 'cloneTask') {
        this.store.dispatch(new CloneTask(taskId));
      } else if (action === 'viewTask') {
        this.nav.toTask(taskId);
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

  downloadNodes(view: PROJECT_NODE_VIEW_TYPE): Observable<void> {
    this.messages.notify.info('General.RetrievingData');

    return this.data.projectExport.runAsync(
      this.store.selectSnapshot(ProjectState.current)!,
      'xlsx',
      this.store.selectSnapshot(
        view === PROJECT_NODE_VIEW.DISCIPLINE
          ? TasksState.disciplines
          : TasksState.phases
      ) ?? []
    );
  }

  reordered([draggedId, rows]: [string, WbsNodeView[]]): void {
    this.store.dispatch(
      new TreeReordered(draggedId, PROJECT_NODE_VIEW.PHASE, rows)
    );
  }
}
