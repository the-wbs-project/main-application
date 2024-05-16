import { Injectable, inject } from '@angular/core';
import { Store } from '@ngxs/store';
import { DialogService } from '@progress/kendo-angular-dialog';
import { LibraryListModalComponent } from '@wbs/components/library/list-modal';
import { TaskCreateComponent } from '@wbs/components/task-create';
import { DataServiceFactory } from '@wbs/core/data-services';
import {
  LibraryImportResults,
  ListItem,
  PROJECT_STATI_TYPE,
  Project,
} from '@wbs/core/models';
import { Messages, Transformers } from '@wbs/core/services';
import { WbsNodeView } from '@wbs/core/view-models';
import { MembershipStore } from '@wbs/core/store';
import { Observable, of } from 'rxjs';
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

  private get project(): Project {
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
    } else if (taskId) {
      if (action === 'addSub') {
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
      } else if (action === 'cloneTask') {
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
        const org = this.membership.organization()!.name;
        const task = this.store
          .selectSnapshot(TasksState.nodes)!
          .find((x) => x.id === taskId)!;
        const types: string[] =
          direction === 'right' || task.parentId != null
            ? ['task']
            : ['phase', 'task'];

        return LibraryListModalComponent.launchAsync(
          this.dialogService,
          org,
          'personal',
          types
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

  downloadTasks(project?: Project, phases?: WbsNodeView[]): void {
    this.messages.notify.info('General.RetrievingData');

    if (!project) {
      project = this.store.selectSnapshot(ProjectState.current)!;
    }
    if (!phases) {
      const nodes = this.store.selectSnapshot(TasksState.nodes)!;

      phases = this.transformers.nodes.phase.view.run(
        nodes,
        'project',
        project.disciplines
      );
    }
    const customDisciplines: ListItem[] = [];

    for (const d of project.disciplines)
      if (typeof d !== 'string')
        customDisciplines.push({
          id: d.id,
          label: d.label,
          description: d.description,
          order: 0,
          tags: [],
          type: 'discipline',
        });

    this.data.wbsExport
      .runAsync(project.title, 'xlsx', customDisciplines, phases)
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
