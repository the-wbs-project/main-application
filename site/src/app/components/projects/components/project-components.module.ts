import { NgModule } from '@angular/core';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { TextBoxModule } from '@progress/kendo-angular-inputs';
import { SharedModule } from '@wbs/shared/module';
import { ActionMenuComponent } from './action-menu.component';
import { CategoryListComponent } from './category-list/category-list.component';
import {
  ProjectCategoryFilterPipe,
  ProjectCategorySortPipe,
} from './category-list/pipes';
import { TitleEditorComponent } from './title-editor/title-editor.component';

@NgModule({
  imports: [NgbDropdownModule, SharedModule, TextBoxModule],
  declarations: [
    ActionMenuComponent,
    CategoryListComponent,
    ProjectCategoryFilterPipe,
    ProjectCategorySortPipe,
    TitleEditorComponent,
  ],
  exports: [ActionMenuComponent, CategoryListComponent, TitleEditorComponent],
})
export class ProjectComponentModule {}
