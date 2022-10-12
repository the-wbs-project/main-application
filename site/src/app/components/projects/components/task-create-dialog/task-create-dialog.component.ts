import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  ViewChild,
} from '@angular/core';
import { DialogContentBase, DialogRef } from '@progress/kendo-angular-dialog';
import { TextBoxComponent } from '@progress/kendo-angular-inputs';
import {
  CAT_LISTS_TYPE,
  ProjectCategory,
  PROJECT_NODE_VIEW,
  PROJECT_NODE_VIEW_TYPE,
  WbsNode,
} from '@wbs/shared/models';
import { CategorySelectionService } from '@wbs/shared/services';
import { CategorySelection } from '@wbs/shared/view-models';
import { BehaviorSubject } from 'rxjs';

@Component({
  templateUrl: './task-create-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskCreateDialogComponent
  extends DialogContentBase
  implements OnInit
{
  @ViewChild(TextBoxComponent, { static: false })
  readonly titleTextBox!: TextBoxComponent;

  readonly discipline: PROJECT_NODE_VIEW_TYPE = PROJECT_NODE_VIEW.DISCIPLINE;
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

  ngOnInit(): void {
    this.focus();
  }

  private focus() {
    if (!this.titleTextBox) {
      setTimeout(() => {
        this.focus();
      }, 50);
      return;
    }
    this.titleTextBox.focus();
  }

  setup(disciplines: ProjectCategory[]): void {
    this.disciplines = this.catService.buildFromList(
      PROJECT_NODE_VIEW.DISCIPLINE,
      disciplines,
      []
    );
  }

  save(nav: boolean): void {
    if (!this.title) return;

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
    this.dialog.close({ model, nav });
  }
}
