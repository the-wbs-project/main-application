import { inject, Injectable } from '@angular/core';
import { DataServiceFactory } from '@wbs/core/data-services';
import { IdService } from '@wbs/core/services';
import { UserStore } from '@wbs/core/store';
import { TASK_ACTIONS } from '@wbs/pages/projects/models';
import { Observable } from 'rxjs';

@Injectable()
export class ProjectTaskActivityService {
  private readonly data = inject(DataServiceFactory);
  private readonly userId = inject(UserStore).userId;

  removeTask(
    owner: string,
    projectId: string,
    taskId: string,
    taskTitle: string,
    reason: string
  ): Observable<void> {
    return this.save(owner, projectId, taskId, TASK_ACTIONS.REMOVED, {
      title: taskTitle,
      reason,
    });
  }

  changeDisciplines(
    owner: string,
    projectId: string,
    taskId: string,
    taskTitle: string,
    from: string[],
    to: string[]
  ): Observable<void> {
    return this.save(
      owner,
      projectId,
      taskId,
      TASK_ACTIONS.DISCIPLINES_CHANGED,
      {
        title: taskTitle,
        from,
        to,
      }
    );
  }

  cloneTask(
    owner: string,
    projectId: string,
    taskId: string,
    taskTitle: string,
    taskLevel: string
  ): Observable<void> {
    return this.save(owner, projectId, taskId, TASK_ACTIONS.CLONED, {
      title: taskTitle,
      level: taskLevel,
    });
  }

  reorderTask(
    owner: string,
    projectId: string,
    taskId: string,
    taskTitle: string,
    from: string,
    to: string
  ): Observable<void> {
    return this.save(owner, projectId, taskId, TASK_ACTIONS.REORDERED, {
      title: taskTitle,
      from,
      to,
    });
  }

  createTask(
    owner: string,
    projectId: string,
    taskId: string,
    taskTitle: string
  ): Observable<void> {
    return this.save(owner, projectId, taskId, TASK_ACTIONS.CREATED, {
      title: taskTitle,
    });
  }

  changeTaskTitle(
    owner: string,
    projectId: string,
    taskId: string,
    from: string,
    to: string
  ): Observable<void> {
    return this.save(owner, projectId, taskId, TASK_ACTIONS.TITLE_CHANGED, {
      from,
      to,
    });
  }

  changeTaskDescription(
    owner: string,
    projectId: string,
    taskId: string,
    from: string,
    to: string
  ): Observable<void> {
    return this.save(
      owner,
      projectId,
      taskId,
      TASK_ACTIONS.DESCRIPTION_CHANGED,
      {
        from,
        to,
      }
    );
  }

  changeTaskAbs(
    owner: string,
    projectId: string,
    taskId: string,
    from: 'set' | undefined,
    to: 'set' | undefined
  ): Observable<void> {
    return this.save(owner, projectId, taskId, TASK_ACTIONS.ABS_CHANGED, {
      from,
      to,
    });
  }

  changeTaskDisciplines(
    owner: string,
    projectId: string,
    taskId: string,
    taskTitle: string,
    from: string[],
    to: string[]
  ): Observable<void> {
    return this.save(
      owner,
      projectId,
      taskId,
      TASK_ACTIONS.DISCIPLINES_CHANGED,
      {
        title: taskTitle,
        from,
        to,
      }
    );
  }

  private save(
    owner: string,
    projectId: string,
    taskId: string,
    action: string,
    data?: any
  ): Observable<void> {
    return this.data.activities.saveProjectAsync(owner, projectId, [
      {
        id: IdService.generate(),
        timestamp: new Date(),
        action,
        data,
        topLevelId: projectId,
        objectId: taskId,
        userId: this.userId()!,
      },
    ]);
  }
}
