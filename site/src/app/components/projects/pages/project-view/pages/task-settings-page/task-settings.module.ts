import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { ButtonModule } from '@progress/kendo-angular-buttons';
import { DropDownListModule } from '@progress/kendo-angular-dropdowns';
import { EditorModule } from '@progress/kendo-angular-editor';
import { TextBoxModule } from '@progress/kendo-angular-inputs';
import { CategoryListEditorModule } from '@wbs/components/_features/category-list-editor';
import { SharedModule } from '@wbs/shared/module';
import {
  TaskSettingsCategoriesComponent,
  TaskSettingsComponent,
  TaskSettingsGeneralComponent,
} from './pages';
import { routes } from './task-settings-routing.module';

@NgModule({
  imports: [
    ButtonModule,
    CategoryListEditorModule,
    DropDownListModule,
    EditorModule,
    FormsModule,
    NgbNavModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
    SharedModule,
    TextBoxModule,
  ],
  providers: [],
  declarations: [
    TaskSettingsCategoriesComponent,
    TaskSettingsComponent,
    TaskSettingsGeneralComponent,
  ],
})
export class TaskSettingsModule {}
