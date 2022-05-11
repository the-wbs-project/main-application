import { ChangeDetectorRef, Component, ViewEncapsulation } from '@angular/core';
import { DialogContentBase, DialogRef } from '@progress/kendo-angular-dialog';
import { SelectEvent } from '@progress/kendo-angular-upload';
import { PROJECT_NODE_VIEW, PROJECT_NODE_VIEW_TYPE } from '@wbs/shared/models';
import { DataServiceFactory } from '@wbs/shared/services';
import { BehaviorSubject, of, switchMap } from 'rxjs';
import { UploadFileService } from '../../services';

@Component({
  templateUrl: './project-node-upload-dialog.component.html',
  encapsulation: ViewEncapsulation.None,
})
export class ProjectNodeUploadDialogComponent extends DialogContentBase {
  readonly errors$ = new BehaviorSubject<string[] | null>(null);
  readonly loading$ = new BehaviorSubject<boolean>(false);

  constructor(
    dialog: DialogRef,
    private readonly cd: ChangeDetectorRef,
    private readonly data: DataServiceFactory,
    private readonly service: UploadFileService
  ) {
    super(dialog);
  }
  projectId?: string;
  viewNode?: PROJECT_NODE_VIEW_TYPE;

  selected(e: SelectEvent) {
    this.loading$.next(true);
    this.cd.detectChanges();
    this.service
      .getFile(e)
      .pipe(
        switchMap((buffer) => {
          if (!buffer) return of(null);

          if (this.viewNode === PROJECT_NODE_VIEW.PHASE) {
            return this.data.extracts.updatePhaseAsync(this.projectId!, buffer);
          }
          return of(null);
        })
      )
      .subscribe((x) => {
        this.loading$.next(false);
        this.cd.detectChanges();

        if (x)
          if (x.errors && x.errors.length > 0) {
            this.errors$.next(x.errors);
            this.cd.detectChanges();
          } else {
            this.dialog.close(x.results);
          }
      });
  }

  close() {
    this.dialog.close();
  }
}
