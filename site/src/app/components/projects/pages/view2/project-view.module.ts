import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NgxsModule } from '@ngxs/store';
import { ButtonModule } from '@progress/kendo-angular-buttons';
import { IconModule } from '@progress/kendo-angular-icons';
import { ContextMenuModule } from '@progress/kendo-angular-menu';
import { FileSelectModule } from '@progress/kendo-angular-upload';
import { SharedModule } from '@wbs/shared/module';
import {
  WbsNodeCreateModule,
  WbsNodeEditorModule,
  WbsNodeGeneralModule,
  WbsTreeModule,
} from '../../../_features';
import { ProjectResourceGuard, ProjectVerifyGuard } from '../../guards';
import {
  ProjectAboutComponent,
  ProjectNodeUploadDialogComponent,
  ProjectPhasesComponent,
  ProjectRoleComponent,
  ProjectViewActionsComponent,
} from './components';
import { ProjectRedirectGuard, ProjectViewGuard } from './guards';
import {
  ProjectStatusPipe,
  RoleIconPipe,
  RoleTitlePipe,
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
    ContextMenuModule,
    FileSelectModule,
    IconModule,
    NgxsModule.forFeature([ProjectViewState]),
    RouterModule.forChild(routes),
    SharedModule,
    WbsNodeCreateModule,
    WbsNodeGeneralModule,
    WbsNodeEditorModule,
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
    ProjectNodeUploadDialogComponent,
    ProjectPhasesComponent,
    ProjectRoleComponent,
    ProjectStatusPipe,
    ProjectView2Component,
    ProjectViewActionsComponent,
    RoleIconPipe,
    RoleTitlePipe,
    UserEmailPipe,
    UserNamePipe,
  ],
})
export class ProjectView2Module {}
