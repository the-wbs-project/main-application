import { Injectable, inject } from '@angular/core';
import { DialogService } from '@progress/kendo-angular-dialog';
import { LIBRARY_ENTRY_TYPES, ProjectNode } from '@wbs/core/models';
import { ProjectViewModel } from '@wbs/core/view-models';
import { ExportToLibraryDialogComponent } from '../components/export-to-library-dialog';
import { Messages, NavigationService } from '@wbs/core/services';
import { MembershipStore } from '@wbs/core/store';

@Injectable()
export class LibraryEntryExportService {
  private readonly dialog = inject(DialogService);
  private readonly membership = inject(MembershipStore).membership;
  private readonly messages = inject(Messages);
  private readonly navigate = inject(NavigationService);

  exportProject(project: ProjectViewModel): void {
    ExportToLibraryDialogComponent.launchAsync(this.dialog, {
      type: LIBRARY_ENTRY_TYPES.PROJECT,
      owner: project.owner,
      projectId: project.id,
      description: project.description,
      title: project.title,
    }).subscribe((recordId) => {
      if (recordId) this.promptForAction(recordId);
    });
  }

  exportPhase(owner: string, projectId: string, task: ProjectNode): void {
    ExportToLibraryDialogComponent.launchAsync(this.dialog, {
      type: LIBRARY_ENTRY_TYPES.PHASE,
      owner: owner,
      projectId: projectId,
      taskId: task.id,
      description: task.description,
      title: task.title,
    }).subscribe((recordId) => {
      if (recordId) this.promptForAction(recordId);
    });
  }

  exportTask(owner: string, projectId: string, task: ProjectNode): void {
    ExportToLibraryDialogComponent.launchAsync(this.dialog, {
      type: LIBRARY_ENTRY_TYPES.TASK,
      owner: owner,
      projectId: projectId,
      taskId: task.id,
      description: task.description,
      title: task.title,
    }).subscribe((recordId) => {
      if (recordId) this.promptForAction(recordId);
    });
  }

  private promptForAction(recordId: string): void {
    this.messages.confirm
      .show(
        'LibraryExport.SuccessTitle',
        'LibraryExport.SuccessMessage',
        { recordId },
        'General.View',
        'General.Close'
      )
      .subscribe((result) => {
        if (result)
          this.navigate.toLibraryEntry(this.membership()!.name, recordId, 1);
      });
  }
}
