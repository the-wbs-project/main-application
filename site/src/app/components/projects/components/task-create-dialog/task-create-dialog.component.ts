//project-create
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DialogContentBase, DialogRef } from '@progress/kendo-angular-dialog';
import {
  ProjectCategory,
  PROJECT_NODE_VIEW,
  WbsNode,
} from '@wbs/shared/models';
import { CategorySelectionService } from '@wbs/shared/services';
import { CategorySelection } from '@wbs/shared/view-models';
import { BehaviorSubject } from 'rxjs';

@Component({
  templateUrl: './task-create-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskCreateDialogComponent extends DialogContentBase {
  readonly more$ = new BehaviorSubject<boolean>(false);
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
    const model: Partial<WbsNode> = {
      title: this.title,
    };

    if (this.more$.getValue()) {
      if (this.description) model.description = this.description;

      const disciplines: string[] = [];

      for (const cat of this.disciplines ?? []) {
        if (cat.selected) disciplines.push(cat.id);
      }
      if (disciplines.length > 0) model.disciplineIds = disciplines;
    }
    this.dialog.close(model);
  }
}
