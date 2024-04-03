import { Injectable, inject } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Store } from '@ngxs/store';
import { DataServiceFactory } from '@wbs/core/data-services';
import {
  Category,
  LIBRARY_ENTRY_TYPES,
  Project,
  ProjectNode,
} from '@wbs/core/models';
import { CategoryState } from '@wbs/main/services';
import { AuthState } from '@wbs/main/states';
import { LibraryEntryModalComponent } from '../components/library-entry-modal/library-entry-modal.component';
import { LibraryEntryModalModel, LibraryEntryModalResults } from '../models';

@Injectable()
export class LibraryEntryExportService {
  private readonly categoryState = inject(CategoryState);
  private readonly data = inject(DataServiceFactory);
  private readonly modalService = inject(NgbModal);
  private readonly store = inject(Store);

  private author(): string {
    return this.store.selectSnapshot(AuthState.userId)!;
  }

  private phases(): Category[] {
    return this.categoryState.phases;
  }

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
            author: this.author(),
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
            author: this.author(),
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
            author: this.author(),
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
