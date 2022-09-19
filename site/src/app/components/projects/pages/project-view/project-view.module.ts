import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NgxsModule } from '@ngxs/store';
import { ButtonModule } from '@progress/kendo-angular-buttons';
import { DialogModule } from '@progress/kendo-angular-dialog';
import { TextBoxModule } from '@progress/kendo-angular-inputs';
import { ContextMenuModule } from '@progress/kendo-angular-menu';
import { TooltipModule } from '@progress/kendo-angular-tooltip';
import { FileSelectModule } from '@progress/kendo-angular-upload';
import { SharedModule } from '@wbs/shared/module';
import {
  CategoryListEditorModule,
  LabelDialogModule,
  WbsTreeModule,
} from '../../../_features';
import { ProjectComponentModule } from '../../components';
import { ProjectResourceGuard, ProjectVerifyGuard } from '../../guards';
import {
  ProjectAboutComponent,
  ProjectCategoryDialogComponent,
  ProjectNodeUploadDialogComponent,
  ProjectPhasesComponent,
  ProjectRoleComponent,
  ProjectTitleComponent,
} from './components';
import { ProjectRedirectGuard, ProjectViewGuard } from './guards';
import {
  RoleIconPipe,
  RoleTitlePipe,
  TaskMenuPipe,
  UserEmailPipe,
  UserNamePipe,
} from './pipes';
import { ProjectView2Component } from './project-view.component';
import { ProjectViewState } from './project-view.state';
import {
  PhaseExtractProcessor,
  TextCompareService,
  UploadFileService,
} from './services';

const routes: Routes = [
  {
    path: '',
    component: ProjectView2Component,
    canActivate: [ProjectRedirectGuard],
  },
  {
    path: ':view',
    component: ProjectView2Component,
    canActivate: [ProjectResourceGuard, ProjectVerifyGuard, ProjectViewGuard],
  },
];

@NgModule({
  imports: [
    ButtonModule,
    CategoryListEditorModule,
    ContextMenuModule,
    DialogModule,
    FileSelectModule,
    LabelDialogModule,
    NgxsModule.forFeature([ProjectViewState]),
    ProjectComponentModule,
    RouterModule.forChild(routes),
    SharedModule,
    TextBoxModule,
    TooltipModule,
    WbsTreeModule,
  ],
  providers: [
    PhaseExtractProcessor,
    ProjectRedirectGuard,
    ProjectViewGuard,
    TextCompareService,
    UploadFileService,
  ],
  declarations: [
    ProjectAboutComponent,
    ProjectCategoryDialogComponent,
    ProjectNodeUploadDialogComponent,
    ProjectPhasesComponent,
    ProjectRoleComponent,
    ProjectTitleComponent,
    ProjectView2Component,
    RoleIconPipe,
    RoleTitlePipe,
    TaskMenuPipe,
    UserEmailPipe,
    UserNamePipe,
  ],
})
export class ProjectView2Module {}
