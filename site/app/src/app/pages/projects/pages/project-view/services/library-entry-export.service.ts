import { Injectable, inject } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { DataServiceFactory } from '@wbs/core/data-services';
import { LIBRARY_ENTRY_TYPES, Project, ProjectNode } from '@wbs/core/models';
import { UserStore } from '@wbs/core/store';
import { LibraryEntryModalComponent } from '../components/library-entry-modal';
import { LibraryEntryModalModel, LibraryEntryModalResults } from '../models';

@Injectable()
export class LibraryEntryExportService {
  private readonly data = inject(DataServiceFactory);
  private readonly modalService = inject(NgbModal);
  private readonly userId = inject(UserStore).userId;

  exportProject(project: Project): void {
    this.getDialog({
      type: LIBRARY_ENTRY_TYPES.PROJECT,
      description: project.description,
      title: project.title,
      categories: [project.category],
    })
      .result.catch(() => {})
      .then((results: LibraryEntryModalResults | undefined) => {
        if (!results) return;

        this.data.projects
          .exportToLibraryAsync(project.owner, project.id, {
            author: this.userId()!,
            ...results,
          })
          .subscribe();
      });
  }

  exportPhase(owner: string, projectId: string, task: ProjectNode): void {
    this.getDialog({
      type: LIBRARY_ENTRY_TYPES.PHASE,
      description: task.description,
      title: task.title,
      categories: [],
    })
      .result.catch(() => {})
      .then((results: LibraryEntryModalResults | undefined) => {
        if (!results) return;

        this.data.projectNodes
          .exportToLibraryAsync(owner, projectId, task.id, {
            author: this.userId()!,
            phase: task.phaseIdAssociation,
            ...results,
          })
          .subscribe();
      });
  }

  exportTask(owner: string, task: ProjectNode): void {
    this.getDialog({
      type: LIBRARY_ENTRY_TYPES.PHASE,
      description: task.description,
      title: task.title,
      categories: [],
    })
      .result.catch(() => {})
      .then((results: LibraryEntryModalResults | undefined) => {
        if (!results) return;

        this.data.projectNodes
          .exportToLibraryAsync(owner, task.projectId, task.id, {
            author: this.userId()!,
            ...results,
          })
          .subscribe();
      });
  }

  private getDialog(data: LibraryEntryModalModel): NgbModalRef {
    const ref = this.modalService.open(LibraryEntryModalComponent, {
      modalDialogClass: 'entry-modal',
      ariaLabelledBy: 'modal-title',
      size: 'fullscreen',
      scrollable: true,
    });

    ref.componentInstance.setup(data);

    return ref;
  }
}
