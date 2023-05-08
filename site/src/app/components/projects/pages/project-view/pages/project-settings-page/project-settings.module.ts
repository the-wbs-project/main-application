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
  ProjectSettingsCategoriesComponent,
  ProjectSettingsComponent,
  ProjectSettingsGeneralComponent,
  ProjectSettingsRolesComponent,
} from './pages';
import { routes } from './project-settings-routing.module';
import { ProjectUserListComponent } from './components';

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
    ProjectSettingsCategoriesComponent,
    ProjectSettingsComponent,
    ProjectSettingsGeneralComponent,
    ProjectSettingsRolesComponent,
    ProjectUserListComponent,
  ],
})
export class ProjectSettingsModule {}
