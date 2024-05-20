import { Injectable, inject } from '@angular/core';
import {
  DialogCloseResult,
  DialogService,
} from '@progress/kendo-angular-dialog';
import { DataServiceFactory } from '@wbs/core/data-services';
import { LIBRARY_ENTRY_TYPES, ProjectNode } from '@wbs/core/models';
import { UserStore } from '@wbs/core/store';
import { ProjectViewModel } from '@wbs/core/view-models';
import { filter, switchMap } from 'rxjs/operators';
import { LibraryEntryModalComponent } from '../components/library-entry-modal';
import { LibraryEntryModalResults } from '../models';

@Injectable()
export class LibraryEntryExportService {
  private readonly data = inject(DataServiceFactory);
  private readonly dialog = inject(DialogService);
  private readonly userId = inject(UserStore).userId;

  exportProject(project: ProjectViewModel): void {
    LibraryEntryModalComponent.launchAsync(this.dialog, {
      type: LIBRARY_ENTRY_TYPES.PROJECT,
      description: project.description,
      title: project.title,
    })
      .pipe(
        filter((x) => !(x instanceof DialogCloseResult)),
        switchMap((results: LibraryEntryModalResults) =>
          this.data.projects.exportToLibraryAsync(project.owner, project.id, {
            author: this.userId()!,
            ...results,
          })
        )
      )
      .subscribe();
  }

  exportPhase(owner: string, projectId: string, task: ProjectNode): void {
    LibraryEntryModalComponent.launchAsync(this.dialog, {
      type: LIBRARY_ENTRY_TYPES.PHASE,
      description: task.description,
      title: task.title,
    })
      .pipe(
        filter((x) => !(x instanceof DialogCloseResult)),
        switchMap((results: LibraryEntryModalResults) =>
          this.data.projectNodes.exportToLibraryAsync(
            owner,
            projectId,
            task.id,
            {
              author: this.userId()!,
              phase: task.phaseIdAssociation,
              ...results,
            }
          )
        )
      )
      .subscribe();
  }

  exportTask(owner: string, task: ProjectNode): void {
    LibraryEntryModalComponent.launchAsync(this.dialog, {
      type: LIBRARY_ENTRY_TYPES.PHASE,
      description: task.description,
      title: task.title,
    })
      .pipe(
        filter((x) => !(x instanceof DialogCloseResult)),
        switchMap((results: LibraryEntryModalResults) =>
          this.data.projectNodes.exportToLibraryAsync(
            owner,
            task.projectId,
            task.id,
            {
              author: this.userId()!,
              ...results,
            }
          )
        )
      )
      .subscribe();
  }
}
