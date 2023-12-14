import { Injectable } from '@angular/core';
import { Store } from '@ngxs/store';
import { DataServiceFactory } from '@wbs/core/data-services';
import {
  ListItem,
  PROJECT_STATI_TYPE,
  Project,
  ProjectCategory,
} from '@wbs/core/models';
import { Messages } from '@wbs/core/services';
import { WbsNodeView } from '@wbs/core/view-models';
import { TaskCreateService } from '@wbs/main/components/task-create';
import { DialogService, Transformers } from '@wbs/main/services';
import { of } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import {
  ChangeProjectStatus,
  CloneTask,
  CreateTask,
  MoveTaskDown,
  MoveTaskLeft,
  MoveTaskRight,
  MoveTaskUp,
  RemoveTask,
} from '../actions';
import { TaskDeleteComponent } from '../components/task-delete/task-delete.component';
import { PROJECT_PAGES, TASK_PAGES } from '../models';
import { ProjectState, TasksState } from '../states';
import { ProjectNavigationService } from './project-navigation.service';
import { AuthState } from '@wbs/main/states';

@Injectable()
export class ProjectViewService {
  constructor(
    private readonly data: DataServiceFactory,
    private readonly dialogs: DialogService,
    private readonly messages: Messages,
    private readonly nav: ProjectNavigationService,
    private readonly store: Store,
    private readonly taskCreate: TaskCreateService,
    private readonly transformers: Transformers
  ) {}

  private get project(): Project {
    return this.store.selectSnapshot(ProjectState.current)!;
  }

  private get owner(): string {
    return this.project.owner;
  }

  private get projectId(): string {
    return this.project.id;
  }

  private get projectDisciplines(): ProjectCategory[] {
    return this.store.selectSnapshot(ProjectState.current)!.disciplines ?? [];
  }

  action(action: string, taskId?: string) {
    if (action === 'download') {
      this.downloadTasks();
    } else if (action === 'upload') {
      this.nav.toProjectPage(PROJECT_PAGES.UPLOAD);
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
        this.nav.toTaskPage(taskId, TASK_PAGES.ABOUT);
      } else if (action === 'deleteTask') {
        this.dialogs
          .openDialog<string>(TaskDeleteComponent)
          .subscribe((reason) => {
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
      } else if (action === 'exportTask') {
        const author = this.store.selectSnapshot(AuthState.userId)!;
        const task = this.store
          .selectSnapshot(TasksState.nodes)!
          .find((x) => x.id === taskId)!;

        this.data.projectNodes
          .exportToLibraryAsync(this.owner, this.projectId, taskId, {
            author,
            title: task.title!,
            description: task.description!,
            includeResources: true,
            visibility: '',
            categories: [],
            phase: '',
          })
          .subscribe();
      }
    }
  }

  uploadTasks(): void {
    this.nav.toProjectPage(PROJECT_PAGES.UPLOAD);
  }

  downloadTasks(project?: Project, phases?: WbsNodeView[]): void {
    this.messages.notify.info('General.RetrievingData');

    if (!project) {
      project = this.store.selectSnapshot(ProjectState.current)!;
    }
    if (!phases) {
      const nodes = this.store.selectSnapshot(TasksState.nodes)!;

      phases = this.transformers.nodes.phase.view.run(project, nodes);
    }
    const customDisciplines: ListItem[] = [];

    for (const d of project.disciplines)
      if (typeof d !== 'string') customDisciplines.push(d);

    this.data.projectExport
      .runAsync(project, 'xlsx', customDisciplines, phases)
      .subscribe();
  }

  confirmAndChangeStatus(
    status: PROJECT_STATI_TYPE,
    confirmMessage: string,
    successMessage: string
  ) {
    this.messages.confirm
      .show('General.Confirm', confirmMessage)
      .pipe(
        switchMap((answer: boolean) => {
          if (!answer) return of();

          return this.store
            .dispatch(new ChangeProjectStatus(status))
            .pipe(
              tap(() =>
                this.messages.report.success('General.Success', successMessage)
              )
            );
        })
      )
      .subscribe();
  }
}
