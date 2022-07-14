import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { NgxsModule } from '@ngxs/store';
import {
  FormFieldModule,
  SwitchModule,
  TextBoxModule,
} from '@progress/kendo-angular-inputs';
import { LabelModule } from '@progress/kendo-angular-label';
import { SortableModule } from '@progress/kendo-angular-sortable';
import { SharedModule } from '@wbs/shared/module';
import {
  BasicsComponent,
  CustomDialogComponent,
  DisciplinesComponent,
  FooterComponent,
  GettingStartedComponent,
  HeaderComponent,
  LibOrScratchComponent,
  NodeViewComponent,
  PhaseComponent,
  SavingComponent,
} from './components';
import { StartCreationGuard } from './guards';
import { ProjectCreateDescriptionPipe, ProjectCreateTitlePipe } from './pipes';
import { ProjectCreateComponent } from './project-create.component';
import { ProjectCreateState } from './project-create.state';

const routes: Routes = [
  {
    path: '',
    component: ProjectCreateComponent,
    canActivate: [StartCreationGuard],
  },
];

@NgModule({
  imports: [
    CommonModule,
    FormFieldModule,
    FormsModule,
    LabelModule,
    NgxsModule.forFeature([ProjectCreateState]),
    ReactiveFormsModule,
    RouterModule.forChild(routes),
    SharedModule,
    SortableModule,
    SwitchModule,
    TextBoxModule,
  ],
  providers: [StartCreationGuard],
  declarations: [
    BasicsComponent,
    CustomDialogComponent,
    DisciplinesComponent,
    FooterComponent,
    GettingStartedComponent,
    HeaderComponent,
    LibOrScratchComponent,
    NodeViewComponent,
    PhaseComponent,
    ProjectCreateComponent,
    ProjectCreateDescriptionPipe,
    ProjectCreateTitlePipe,
    SavingComponent,
  ],
})
export class ProjectCreateModule {}
