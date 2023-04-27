import { NgModule } from '@angular/core';
import { ButtonModule } from '@progress/kendo-angular-buttons';
import { TextBoxModule } from '@progress/kendo-angular-inputs';
import { SharedModule } from '@wbs/shared/module';
import { CategoryListComponent } from './category-list/category-list.component';
import {
  ProjectCategoryFilterPipe,
  ProjectCategorySortPipe,
} from './category-list/pipes';
import { TitleEditorComponent } from './title-editor/title-editor.component';

@NgModule({
  imports: [ButtonModule, SharedModule, TextBoxModule],
  declarations: [
    CategoryListComponent,
    ProjectCategoryFilterPipe,
    ProjectCategorySortPipe,
    TitleEditorComponent,
  ],
  exports: [CategoryListComponent, TitleEditorComponent],
})
export class ProjectComponentModule {}
