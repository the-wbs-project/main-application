import { Injectable, inject } from '@angular/core';
import { Store } from '@ngxs/store';
import { DialogService } from '@progress/kendo-angular-dialog';
import { LibraryListModalComponent } from '@wbs/components/library/list-modal';
import { TaskCreateComponent } from '@wbs/components/task-create';
import { DataServiceFactory } from '@wbs/core/data-services';
import { LibraryImportResults, PROJECT_STATI_TYPE } from '@wbs/core/models';
import { Messages, Transformers } from '@wbs/core/services';
import { ProjectViewModel } from '@wbs/core/view-models';
import { MembershipStore, UserStore } from '@wbs/core/store';
import { Observable, forkJoin, of } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';
import {
  AddDisciplineToTask,
  ChangeProjectStatus,
  CloneTask,
  CreateTask,
  MoveTaskDown,
  MoveTaskLeft,
  MoveTaskRight,
  MoveTaskUp,
  RemoveDisciplineToTask,
  RemoveTask,
} from '../actions';
import { TaskDeleteComponent } from '../components/task-delete';
import { PROJECT_PAGES, TASK_PAGES } from '../models';
import { ProjectState, TasksState } from '../states';
import { LibraryEntryExportService } from './library-entry-export.service';
import { ProjectNavigationService } from './project-navigation.service';
import { ProjectImportProcessorService } from './project-import-processor.service';

@Injectable()
export class ProjectViewService {
  private readonly data = inject(DataServiceFactory);
  private readonly dialogService = inject(DialogService);
  private readonly exportService = inject(LibraryEntryExportService);
  private readonly importProcessor = inject(ProjectImportProcessorService);
  private readonly membership = inject(MembershipStore);
  private readonly messages = inject(Messages);
  private readonly nav = inject(ProjectNavigationService);
  private readonly store = inject(Store);
  private readonly transformers = inject(Transformers);
  private readonly userId = inject(UserStore).userId;

  private get project(): ProjectViewModel {
    return this.store.selectSnapshot(ProjectState.current)!;
  }

  private get owner(): string {
    return this.project.owner;
  }

  action(action: string, taskId?: string): void | Observable<boolean> {
    if (action === 'download') {
      this.downloadTasks();
    } else if (action === 'upload') {
      this.nav.toProjectPage(PROJECT_PAGES.UPLOAD);
    } else if (action === 'addSub') {
      const sub = TaskCreateComponent.launchAsync(
        this.dialogService,
        this.project.disciplines
      )
        .pipe(
          switchMap((results) =>
            results
              ? this.store.dispatch(
                  new CreateTask(taskId, results.model, results.nav)
                )
              : of()
          )
        )
        .subscribe(() => {
          sub.unsubscribe();
        });
    } else if (taskId) {
      if (action === 'cloneTask') {
        this.store.dispatch(new CloneTask(taskId));
      } else if (action === 'viewTask') {
        this.nav.toTaskPage(taskId, TASK_PAGES.ABOUT);
      } else if (action === 'deleteTask') {
        return TaskDeleteComponent.launchAsync(this.dialogService).pipe(
          switchMap((reason) =>
            reason
              ? this.store
                  .dispatch(new RemoveTask(taskId, reason))
                  .pipe(map(() => true))
              : of(false)
          )
        );
      } else if (action === 'moveLeft') {
        this.store.dispatch(new MoveTaskLeft(taskId));
      } else if (action === 'moveRight') {
        this.store.dispatch(new MoveTaskRight(taskId));
      } else if (action === 'moveUp') {
        this.store.dispatch(new MoveTaskUp(taskId));
      } else if (action === 'moveDown') {
        this.store.dispatch(new MoveTaskDown(taskId));
      } else if (action === 'exportTask') {
        const task = this.store
          .selectSnapshot(TasksState.nodes)!
          .find((x) => x.id === taskId)!;

        if (task.parentId == null)
          this.exportService.exportPhase(this.owner, this.project.id, task);
        else if (task) this.exportService.exportTask(this.owner, task);
      } else if (action.startsWith('addDiscipline|')) {
        const discipline = action.split('|')[1];

        return this.store
          .dispatch(new AddDisciplineToTask(taskId!, discipline))
          .pipe(map(() => true));
      } else if (action.startsWith('removeDiscipline|')) {
        const discipline = action.split('|')[1];

        return this.store
          .dispatch(new RemoveDisciplineToTask(taskId!, discipline))
          .pipe(map(() => true));
      } else if (action.startsWith('import|')) {
        const direction = action.split('|')[1]!;

        return LibraryListModalComponent.launchAsync(
          this.dialogService,
          this.membership.membership()!.name,
          this.userId()!,
          'personal',
          'all'
        ).pipe(
          switchMap((results: LibraryImportResults | undefined) =>
            !results
              ? of(false)
              : this.importProcessor
                  .importAsync(taskId, direction, results)
                  .pipe(map(() => true))
          )
        );
      }
    }
  }

  uploadTasks(): void {
    this.nav.toProjectPage(PROJECT_PAGES.UPLOAD);
  }

  downloadTasks(): void {
    this.messages.notify.info('General.RetrievingData');

    forkJoin([
      this.store.selectOnce(ProjectState.current),
      this.store.selectOnce(TasksState.nodes),
    ])
      .pipe(
        map(([project, nodes]) => ({ project: project!, nodes: nodes! })),
        switchMap(({ project, nodes }) => {
          const tasks = this.transformers.nodes.phase.view.forProject(
            nodes,
            project.disciplines
          );

          return this.data.wbsExport.runAsync(
            project.title,
            'xlsx',
            project.disciplines.filter((x) => x.isCustom),
            tasks
          );
        })
      )
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
