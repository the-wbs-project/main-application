import { Component, ViewEncapsulation } from '@angular/core';
import { DialogContentBase, DialogRef } from '@progress/kendo-angular-dialog';
import {
  ProjectCategory,
  PROJECT_NODE_VIEW,
  PROJECT_NODE_VIEW_TYPE,
} from '@wbs/shared/models';
import { CategorySelectionService } from '@wbs/shared/services';
import { CategorySelection } from '@wbs/shared/view-models';

@Component({
  templateUrl: './project-category-dialog.component.html',
  encapsulation: ViewEncapsulation.None,
})
export class ProjectCategoryDialogComponent extends DialogContentBase {
  title?: string;
  categories?: CategorySelection[];
  categoryType?: PROJECT_NODE_VIEW_TYPE;

  constructor(
    dialog: DialogRef,
    private readonly catService: CategorySelectionService
  ) {
    super(dialog);
  }

  setup(
    title: string,
    categoryType: PROJECT_NODE_VIEW_TYPE,
    categories: ProjectCategory[]
  ): void {
    console.log(categories);
    this.title = title;
    this.categoryType = categoryType;
    this.categories = this.catService.build(categoryType, categories);
    console.log(this.categories);
  }

  save() {
    this.dialog.close(this.catService.extract(this.categories, true));
  }
}
