import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxsModule } from '@ngxs/store';
import { ButtonModule } from '@progress/kendo-angular-buttons';
import { TextBoxModule } from '@progress/kendo-angular-inputs';
import { ContextMenuModule } from '@progress/kendo-angular-menu';
import { TooltipModule } from '@progress/kendo-angular-tooltip';
import { CategoryListEditorModule } from '@wbs/components/_features/category-list-editor';
import { TaskCreateModule } from '@wbs/components/_features/task-create';
import { TaskDeleteModule } from '@wbs/components/_features/task-delete';
import { TimelineModule } from '@wbs/components/_features/timeline';
import { WbsTreeModule } from '@wbs/components/_features/wbs-tree';
import { SharedModule } from '@wbs/shared/module';
import { ProjectComponentModule } from '../../components';
import {
  ProjectResourceGuard,
  ProjectTimelineVerifyGuard,
  ProjectVerifyGuard,
} from '../../guards';
import {
  ProjectAboutComponent,
  ProjectCategoryDialogComponent,
  ProjectPhasesComponent,
  ProjectRoleComponent,
  Timeline1Component,
} from './components';
import { ProjectRedirectGuard, ProjectViewGuard } from './guards';
import {
  RoleIconPipe,
  RoleTitlePipe,
  TaskMenuPipe,
  UserEmailPipe,
  UserNamePipe,
} from './pipes';
import { ProjectViewComponent } from './project-view.component';
import { ProjectViewState } from './project-view.state';
import {
  PhaseExtractProcessor,
  TextCompareService,
  UploadFileService,
} from './services';

const routes: Routes = [
  {
    path: '',
    component: ProjectViewComponent,
    canActivate: [ProjectRedirectGuard],
  },
  {
    path: ':view',
    component: ProjectViewComponent,
    canActivate: [
      ProjectResourceGuard,
      ProjectVerifyGuard,
      ProjectTimelineVerifyGuard,
      ProjectViewGuard,
    ],
  },
];

@NgModule({
  imports: [
    ButtonModule,
    CategoryListEditorModule,
    ContextMenuModule,
    NgbNavModule,
    NgxsModule.forFeature([ProjectViewState]),
    ProjectComponentModule,
    RouterModule.forChild(routes),
    SharedModule,
    TaskCreateModule,
    TaskDeleteModule,
    TextBoxModule,
    TimelineModule,
    TooltipModule,
    WbsTreeModule,
  ],
  providers: [
    PhaseExtractProcessor,
    ProjectRedirectGuard,
    ProjectResourceGuard,
    ProjectTimelineVerifyGuard,
    ProjectVerifyGuard,
    ProjectViewGuard,
    TextCompareService,
    UploadFileService,
  ],
  declarations: [
    ProjectAboutComponent,
    ProjectCategoryDialogComponent,
    ProjectPhasesComponent,
    ProjectRoleComponent,
    ProjectViewComponent,
    RoleIconPipe,
    RoleTitlePipe,
    TaskMenuPipe,
    Timeline1Component,
    UserEmailPipe,
    UserNamePipe,
  ],
})
export class ProjectViewModule {}
