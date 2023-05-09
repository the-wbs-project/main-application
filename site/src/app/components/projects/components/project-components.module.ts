import { NgModule } from '@angular/core';
import { TextBoxModule } from '@progress/kendo-angular-inputs';
import { SharedModule } from '@wbs/shared/module';
import { CategoryListComponent } from './category-list/category-list.component';
import {
  ProjectCategoryFilterPipe,
  ProjectCategorySortPipe,
} from './category-list/pipes';

@NgModule({
  imports: [SharedModule, TextBoxModule],
  declarations: [
    CategoryListComponent,
    ProjectCategoryFilterPipe,
    ProjectCategorySortPipe,
  ],
  exports: [CategoryListComponent],
})
export class ProjectComponentModule {}
