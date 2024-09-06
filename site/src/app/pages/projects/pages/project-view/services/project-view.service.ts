import { Injectable, inject } from '@angular/core';
import { DialogService } from '@progress/kendo-angular-dialog';
import { DataServiceFactory } from '@wbs/core/data-services';
import { PROJECT_STATI_TYPE } from '@wbs/core/models';
import { Messages, Transformers } from '@wbs/core/services';
import { ProjectViewModel } from '@wbs/core/view-models';
import { Observable, of } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';
import { TaskDeleteComponent } from '../components/task-delete';
import { ProjectStore } from '../stores';
import { LibraryEntryExportService } from './library-entry-export.service';
import { ProjectService } from './project.service';
import { ProjectImportService } from './project-import.service';
import { ProjectTaskService } from './project-task.service';

@Injectable()
export class ProjectViewService {
  private readonly data = inject(DataServiceFactory);
  private readonly dialogService = inject(DialogService);
  private readonly exportService = inject(LibraryEntryExportService);
  private readonly messages = inject(Messages);
  private readonly projectService = inject(ProjectService);
  private readonly projectStore = inject(ProjectStore);
  private readonly taskService = inject(ProjectTaskService);
  private readonly transformers = inject(Transformers);
  private readonly importService = inject(ProjectImportService);

  private get project(): ProjectViewModel {
    return this.projectStore.project()!;
  }

  private get owner(): string {
    return this.project.owner;
  }

  action(
    action: string,
    taskId: string
  ): void | Observable<void> | Observable<boolean> {
    if (action === 'cloneTask') {
      this.taskService.cloneTask(taskId).subscribe();
    } else if (action === 'deleteTask') {
      return TaskDeleteComponent.launchAsync(this.dialogService).pipe(
        switchMap((reason) =>
          reason
            ? this.taskService.remove(taskId, reason).pipe(map(() => true))
            : of(false)
        )
      );
    } else if (action === 'moveLeft') {
      this.taskService.moveTaskLeft(taskId).subscribe();
    } else if (action === 'moveRight') {
      this.taskService.moveTaskRight(taskId).subscribe();
    } else if (action === 'moveUp') {
      this.taskService.moveTaskUp(taskId).subscribe();
    } else if (action === 'moveDown') {
      this.taskService.moveTaskDown(taskId).subscribe();
    } else if (action === 'setAbsFlag') {
      return this.taskService
        .changeTaskAbs(taskId, 'set')
        .pipe(map(() => true));
    } else if (action === 'removeAbsFlag') {
      return this.taskService
        .changeTaskAbs(taskId, undefined)
        .pipe(map(() => true));
    } else if (action === 'exportTask') {
      const task = this.projectStore.tasks()!.find((x) => x.id === taskId)!;

      if (task.parentId == null)
        this.exportService.exportPhase(this.owner, this.project.id, task);
      else if (task) this.exportService.exportTask(this.owner, task);
    } else if (action.startsWith('import|library')) {
      return this.importService.importFromLibraryAsync(taskId);
    } else if (action.startsWith('import|file')) {
      return this.importService.importFromFileAsync(taskId);
    }
  }

  downloadTasks(abs: boolean): void {
    this.messages.notify.info('General.RetrievingData');

    const project = this.project;
    const nodes = this.projectStore.tasks()!;
    let tasks = abs
      ? this.transformers.nodes.phase.view.forAbsProject(
          nodes,
          project.disciplines
        )
      : this.transformers.nodes.phase.view.forProject(
          nodes,
          project.disciplines
        );

    this.data.wbsExport
      .runAsync(
        project.title,
        'xlsx',
        project.disciplines.filter((x) => x.isCustom),
        tasks
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

          return this.projectService
            .changeProjectStatus(status)
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
