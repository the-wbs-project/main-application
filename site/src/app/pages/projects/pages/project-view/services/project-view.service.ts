import { Injectable, inject } from '@angular/core';
import { DialogService } from '@progress/kendo-angular-dialog';
import { DataServiceFactory } from '@wbs/core/data-services';
import { PROJECT_STATI, PROJECT_STATI_TYPE } from '@wbs/core/models';
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

  action(action: string, taskId: string): void | Observable<any> {
    if (action === 'cloneTask') {
      return this.taskService.cloneTask(taskId);
    } else if (action === 'deleteTask') {
      return TaskDeleteComponent.launchAsync(this.dialogService).pipe(
        switchMap((reason) =>
          reason
            ? this.taskService.remove(taskId, reason).pipe(map(() => true))
            : of(false)
        )
      );
    } else if (action === 'moveLeft') {
      return this.taskService.moveTaskLeft(taskId);
    } else if (action === 'moveRight') {
      return this.taskService.moveTaskRight(taskId);
    } else if (action === 'moveUp') {
      return this.taskService.moveTaskUp(taskId);
    } else if (action === 'moveDown') {
      return this.taskService.moveTaskDown(taskId);
    } else if (action === 'setAbsFlag') {
      return this.taskService.changeTaskAbs(taskId, 'set');
    } else if (action === 'removeAbsFlag') {
      return this.taskService.changeTaskAbs(taskId, undefined);
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
    const disciplnes = this.projectStore.projectDisciplines();
    let tasks = abs
      ? this.transformers.nodes.phase.view.forAbsProject(nodes, disciplnes)
      : this.transformers.nodes.phase.view.forProject(nodes, disciplnes);

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

          const obj =
            status === PROJECT_STATI.CANCELLED
              ? this.projectService.cancelProject()
              : this.projectService.changeProjectStatus(status);

          return obj.pipe(
            tap(() =>
              this.messages.report.success('General.Success', successMessage)
            )
          );
        })
      )
      .subscribe();
  }
}
