import { NgModule } from '@angular/core';
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
  ProjectAboutPageComponent,
  ProjectDisciplinesPageComponent,
  ProjectPhasesPageComponent,
  ProjectTimelinePageComponent,
} from './pages';
import {
  RoleIconPipe,
  RoleTitlePipe,
  TaskMenuPipe,
  UserEmailPipe,
  UserNamePipe,
} from './pipes';
import { ProjectViewLayoutComponent } from './project-view-layout.component';
import { ProjectViewRoutingModule } from './project-view-routing.module';
import {
  PhaseExtractProcessor,
  ProjectViewService,
  TextCompareService,
  UploadFileService,
} from './services';
import { ProjectViewState } from './states';

@NgModule({
  imports: [
    ButtonModule,
    CategoryListEditorModule,
    ContextMenuModule,
    NgbNavModule,
    NgxsModule.forFeature([ProjectViewState]),
    ProjectComponentModule,
    ProjectViewRoutingModule,
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
    ProjectViewService,
    ProjectVerifyGuard,
    ProjectViewGuard,
    TextCompareService,
    UploadFileService,
  ],
  declarations: [
    ProjectAboutComponent,
    ProjectAboutPageComponent,
    ProjectCategoryDialogComponent,
    ProjectDisciplinesPageComponent,
    ProjectPhasesComponent,
    ProjectPhasesPageComponent,
    ProjectRoleComponent,
    ProjectTimelinePageComponent,
    ProjectViewLayoutComponent,
    RoleIconPipe,
    RoleTitlePipe,
    TaskMenuPipe,
    Timeline1Component,
    UserEmailPipe,
    UserNamePipe,
  ],
})
export class ProjectViewModule {}
