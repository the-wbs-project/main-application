import { Component, ViewEncapsulation } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ProjectCategory, PROJECT_NODE_VIEW_TYPE } from '@wbs/core/models';
import { CategorySelectionService } from '@wbs/core/services';
import { CategorySelection } from '@wbs/core/view-models';

@Component({
  templateUrl: './project-category-dialog.component.html',
  encapsulation: ViewEncapsulation.None,
})
export class ProjectCategoryDialogComponent {
  title?: string;
  categories?: CategorySelection[];
  categoryType?: PROJECT_NODE_VIEW_TYPE;

  constructor(
    readonly modal: NgbActiveModal,
    private readonly catService: CategorySelectionService
  ) {}

  setup(data: {
    title: string;
    categoryType: PROJECT_NODE_VIEW_TYPE;
    categories: ProjectCategory[];
  }): void {
    this.title = data.title;
    this.categoryType = data.categoryType;
    this.categories = this.catService.build(data.categoryType, data.categories);
    console.log(this.categories);
  }

  save() {
    this.modal.close(this.catService.extract(this.categories, true));
  }
}
