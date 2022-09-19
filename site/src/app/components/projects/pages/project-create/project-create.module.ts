import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { NgxsModule } from '@ngxs/store';
import {
  FormFieldModule,
  SwitchModule,
  TextAreaModule,
  TextBoxModule,
} from '@progress/kendo-angular-inputs';
import { LabelModule } from '@progress/kendo-angular-label';
import { SortableModule } from '@progress/kendo-angular-sortable';
import { CategoryListEditorModule } from '@wbs/components/_features';
import { SharedModule } from '@wbs/shared/module';
import { ProjectComponentModule } from '../../components';
import { ProjectResourceGuard } from '../../guards';
import {
  BasicsComponent,
  CategoriesComponent,
  CustomDialogComponent,
  DisciplinesComponent,
  FooterComponent,
  GettingStartedComponent,
  HeaderComponent,
  LibOrScratchComponent,
  NodeViewComponent,
  PhaseComponent,
} from './components';
import { StartCreationGuard } from './guards';
import { ProjectCreateComponent } from './project-create.component';
import { ProjectCreateState } from './project-create.state';

const routes: Routes = [
  {
    path: '',
    component: ProjectCreateComponent,
    canActivate: [ProjectResourceGuard, StartCreationGuard],
  },
];

@NgModule({
  imports: [
    CategoryListEditorModule,
    CommonModule,
    FormFieldModule,
    FormsModule,
    LabelModule,
    NgxsModule.forFeature([ProjectCreateState]),
    ProjectComponentModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
    SharedModule,
    SortableModule,
    SwitchModule,
    TextAreaModule,
    TextBoxModule,
  ],
  providers: [StartCreationGuard],
  declarations: [
    BasicsComponent,
    CategoriesComponent,
    CustomDialogComponent,
    DisciplinesComponent,
    FooterComponent,
    GettingStartedComponent,
    HeaderComponent,
    LibOrScratchComponent,
    NodeViewComponent,
    PhaseComponent,
    ProjectCreateComponent,
  ],
})
export class ProjectCreateModule {}
