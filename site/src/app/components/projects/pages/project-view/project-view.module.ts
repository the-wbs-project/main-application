import { NgModule } from '@angular/core';
import {
  NgbDropdownModule,
  NgbNavModule,
  NgbTooltipModule,
} from '@ng-bootstrap/ng-bootstrap';
import { NgxsModule } from '@ngxs/store';
import { ButtonModule } from '@progress/kendo-angular-buttons';
import { TextBoxModule } from '@progress/kendo-angular-inputs';
import { SplitterModule } from '@progress/kendo-angular-layout';
import { TaskCreateModule } from '@wbs/components/_features/task-create';
import { TaskDeleteModule } from '@wbs/components/_features/task-delete';
import { TextEditorModule } from '@wbs/components/_features/text-editor/text-editor.module';
import { TextareaEditorModule } from '@wbs/components/_features/textarea-editor/textarea-editor.module';
import { TimelineModule } from '@wbs/components/_features/timeline';
import { WbsActionButtonsModule } from '@wbs/components/_features/wbs-action-buttons';
import { WbsTreeModule } from '@wbs/components/_features/wbs-tree';
import { SharedModule } from '@wbs/shared/module';
import { ProjectComponentModule } from '../../components';
import { ProjectTimelineVerifyGuard, ProjectVerifyGuard } from '../../guards';
import {
  ProjectChecklistComponent,
  ProjectRoleComponent,
  TaskDetailsComponent,
  TaskModalComponent,
  Timeline1Component,
} from './components';
import {
  ProjectDiscussionGuard,
  ProjectRedirectGuard,
  ProjectViewGuard,
  TaskVerifyGuard,
  TaskViewGuard,
} from './guards';
import {
  ProjectAboutPageComponent,
  ProjectDisciplinesPageComponent,
  ProjectPhasesPageComponent,
  ProjectTimelinePageComponent,
  TaskAboutComponent,
  TaskSubTasksComponent,
  TaskTestComponent,
  TaskViewComponent,
} from './pages';
import {
  RoleIconPipe,
  RoleTitlePipe,
  TaskDetailsActionsPipe,
  TaskMenuPipe,
  UserEmailPipe,
  UserNamePipe,
} from './pipes';
import { ProjectViewLayoutComponent } from './project-view-layout.component';
import { ProjectViewRoutingModule } from './project-view-routing.module';
import {
  PhaseExtractProcessor,
  ProjectChecklistService,
  ProjectNavigationService,
  ProjectViewService,
  TextCompareService,
  UploadFileService,
} from './services';
import {
  ProjectChecklistState,
  ProjectViewState,
  TaskViewState,
} from './states';

@NgModule({
  imports: [
    ButtonModule,
    NgbDropdownModule,
    NgbNavModule,
    NgbTooltipModule,
    NgxsModule.forFeature([
      ProjectChecklistState,
      ProjectViewState,
      TaskViewState,
    ]),
    ProjectComponentModule,
    ProjectViewRoutingModule,
    SharedModule,
    SplitterModule,
    TaskCreateModule,
    TaskDeleteModule,
    TextareaEditorModule,
    TextBoxModule,
    TextEditorModule,
    TimelineModule,
    WbsActionButtonsModule,
    WbsTreeModule,
  ],
  providers: [
    PhaseExtractProcessor,
    ProjectChecklistService,
    ProjectDiscussionGuard,
    ProjectNavigationService,
    ProjectRedirectGuard,
    ProjectTimelineVerifyGuard,
    ProjectViewService,
    ProjectVerifyGuard,
    ProjectViewGuard,
    TaskVerifyGuard,
    TaskViewGuard,
    TextCompareService,
    UploadFileService,
  ],
  declarations: [
    ProjectAboutPageComponent,
    ProjectChecklistComponent,
    ProjectDisciplinesPageComponent,
    ProjectPhasesPageComponent,
    ProjectRoleComponent,
    ProjectTimelinePageComponent,
    ProjectViewLayoutComponent,
    RoleIconPipe,
    RoleTitlePipe,
    TaskAboutComponent,
    TaskDetailsActionsPipe,
    TaskDetailsComponent,
    TaskMenuPipe,
    TaskModalComponent,
    TaskSubTasksComponent,
    TaskTestComponent,
    TaskViewComponent,
    Timeline1Component,
    UserEmailPipe,
    UserNamePipe,
  ],
})
export class ProjectViewModule {}
