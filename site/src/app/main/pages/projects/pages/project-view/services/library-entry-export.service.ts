import { Injectable } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Store } from '@ngxs/store';
import { DataServiceFactory } from '@wbs/core/data-services';
import {
  LIBRARY_ENTRY_TYPES,
  ListItem,
  Project,
  ProjectCategory,
  ProjectNode,
} from '@wbs/core/models';
import { Resources } from '@wbs/core/services';
import { AuthState, MetadataState } from '@wbs/main/states';
import { LibraryEntryModalComponent } from '../components/library-entry-modal/library-entry-modal.component';
import { LibraryEntryModalModel, LibraryEntryModalResults } from '../models';

@Injectable()
export class LibraryEntryExportService {
  constructor(
    private readonly data: DataServiceFactory,
    private readonly modalService: NgbModal,
    private readonly resources: Resources,
    private readonly store: Store
  ) {}

  private author(): string {
    return this.store.selectSnapshot(AuthState.userId)!;
  }

  private phases(): ListItem[] {
    return this.store.selectSnapshot(MetadataState.phases);
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

  exportPhase(
    owner: string,
    projectId: string,
    phase: ProjectCategory,
    task: ProjectNode | undefined
  ): void {
    const phaseId = typeof phase === 'string' ? phase : phase.id;
    const phase2 =
      typeof phase === 'string'
        ? this.phases().find((x) => x.id === phase)
        : phase;

    let title = task?.title ?? phase2?.label;
    let description = task?.description ?? phase2?.description;

    if (title && title === phase2?.label) title = this.resources.get(title);

    if (description && description === phase2?.description)
      description = this.resources.get(description);

    if (!title) title = '';
    if (!description) description = '';

    this.getDialog({
      type: LIBRARY_ENTRY_TYPES.PHASE,
      description,
      title,
      categories: [],
    })
      .result.catch(() => {})
      .then((results: LibraryEntryModalResults | undefined) => {
        if (!results) return;

        this.data.projectNodes
          .exportToLibraryAsync(owner, projectId, phaseId, {
            author: this.author(),
            phase,
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
            phase: null,
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
