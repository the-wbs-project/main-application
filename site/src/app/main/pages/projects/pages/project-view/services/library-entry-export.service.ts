import { Injectable } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Store } from '@ngxs/store';
import { DataServiceFactory } from '@wbs/core/data-services';
import { LIBRARY_ENTRY_TYPES, Project, ProjectNode } from '@wbs/core/models';
import { AuthState } from '@wbs/main/states';
import { switchMap } from 'rxjs/operators';
import { LibraryEntryModalComponent } from '../components/library-entry-modal/library-entry-modal.component';
import { LibraryEntryModalModel, LibraryEntryModalResults } from '../models';

@Injectable()
export class LibraryEntryExportService {
  constructor(
    private readonly data: DataServiceFactory,
    private readonly modalService: NgbModal,
    private readonly store: Store
  ) {}

  private author(): string {
    return this.store.selectSnapshot(AuthState.userId)!;
  }

  exportProject(project: Project): void {
    const dialog = this.getDialog({
      type: LIBRARY_ENTRY_TYPES.PROJECT,
      description: project.description,
      title: project.title,
      categories: [project.category],
    });

    const sub1 = dialog.dismissed.subscribe(() => {
      sub1.unsubscribe();
      sub2.unsubscribe();
    });
    const sub2 = dialog.closed
      .pipe(
        switchMap((results: LibraryEntryModalResults) => {
          return this.data.projects.exportToLibraryAsync(
            project.owner,
            project.id,
            {
              author: this.author(),
              categories: results.categories,
              description: results.description,
              includeResources: results.includeResources,
              visibility: results.visibility,
              title: results.title,
            }
          );
        })
      )
      .subscribe(() => {
        sub1.unsubscribe();
        sub2.unsubscribe();
      });
  }

  exportPhase(owner: string, task: ProjectNode): void {
    const dialog = this.getDialog({
      type: LIBRARY_ENTRY_TYPES.PHASE,
      description: task.description,
      title: task.title,
      categories: [],
    });
    const sub1 = dialog.dismissed.subscribe(() => {
      sub1.unsubscribe();
      sub2.unsubscribe();
    });
    const sub2 = dialog.closed
      .pipe(
        switchMap((results: LibraryEntryModalResults) => {
          return this.data.projectNodes.exportToLibraryAsync(
            owner,
            task.projectId,
            task.id,
            {
              author: this.author(),
              categories: results.categories,
              description: results.description,
              includeResources: results.includeResources,
              visibility: results.visibility,
              title: results.title,
            }
          );
        })
      )
      .subscribe(() => {
        sub1.unsubscribe();
        sub2.unsubscribe();
      });
  }

  exportTask(owner: string, task: ProjectNode): void {
    const dialog = this.getDialog({
      type: LIBRARY_ENTRY_TYPES.PHASE,
      description: task.description,
      title: task.title,
      categories: [],
    });
    const sub1 = dialog.dismissed.subscribe(() => {
      sub1.unsubscribe();
      sub2.unsubscribe();
    });
    const sub2 = dialog.closed
      .pipe(
        switchMap((results: LibraryEntryModalResults) => {
          return this.data.projectNodes.exportToLibraryAsync(
            owner,
            task.projectId,
            task.id,
            {
              author: this.author(),
              categories: results.categories,
              description: results.description,
              includeResources: results.includeResources,
              visibility: results.visibility,
              title: results.title,
            }
          );
        })
      )
      .subscribe(() => {
        sub1.unsubscribe();
        sub2.unsubscribe();
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
