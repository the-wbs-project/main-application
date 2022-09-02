//project-create
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DialogContentBase, DialogRef } from '@progress/kendo-angular-dialog';
import { ProjectCategory, PROJECT_NODE_VIEW } from '@wbs/shared/models';
import { CategorySelectionService } from '@wbs/shared/services';
import { CategorySelection } from '@wbs/shared/view-models';

@Component({
  templateUrl: './task-create-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskCreateDialogComponent extends DialogContentBase {
  title = '';
  description = '';
  disciplines?: CategorySelection[];

  constructor(
    dialog: DialogRef,
    private readonly catService: CategorySelectionService
  ) {
    super(dialog);
  }

  setup(disciplines: ProjectCategory[]): void {
    this.disciplines = this.catService.buildFromList(
      PROJECT_NODE_VIEW.DISCIPLINE,
      disciplines,
      []
    );
  }

  save(): void {
    //
  }
}
