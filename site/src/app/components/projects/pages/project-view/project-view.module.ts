import { NgModule } from '@angular/core';
import {
  NgbModalModule,
  NgbNavModule,
  NgbTooltipModule,
} from '@ng-bootstrap/ng-bootstrap';
import { NgxsModule } from '@ngxs/store';
import { ButtonModule } from '@progress/kendo-angular-buttons';
import { TextBoxModule } from '@progress/kendo-angular-inputs';
import { SplitterModule } from '@progress/kendo-angular-layout';
import { ContextMenuModule } from '@progress/kendo-angular-menu';
import { CategoryListEditorModule } from '@wbs/components/_features/category-list-editor';
import { TaskCreateModule } from '@wbs/components/_features/task-create';
import { TaskDeleteModule } from '@wbs/components/_features/task-delete';
import { TextEditorModule } from '@wbs/components/_features/text-editor/text-editor.module';
import { TextareaEditorModule } from '@wbs/components/_features/textarea-editor/textarea-editor.module';
import { TimelineModule } from '@wbs/components/_features/timeline';
import { WbsActionButtonsModule } from '@wbs/components/_features/wbs-action-buttons';
import { WbsTreeModule } from '@wbs/components/_features/wbs-tree';
import { SharedModule } from '@wbs/shared/module';
import { ProjectComponentModule } from '../../components';
import {
  ProjectResourceGuard,
  ProjectTimelineVerifyGuard,
  ProjectVerifyGuard,
} from '../../guards';
import {
  ProjectCategoryDialogComponent,
  ProjectPhasesComponent,
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
  ProjectDiscussionLayoutComponent,
  ProjectDiscussionListPageComponent,
  ProjectDiscussionWritePageComponent,
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
  ProjectNavigationService,
  ProjectViewService,
  TextCompareService,
  UploadFileService,
} from './services';
import {
  ProjectDiscussionState,
  ProjectViewState,
  TaskViewState,
} from './states';

@NgModule({
  imports: [
    ButtonModule,
    CategoryListEditorModule,
    ContextMenuModule,
    NgbModalModule,
    NgbNavModule,
    NgbTooltipModule,
    NgxsModule.forFeature([
      ProjectDiscussionState,
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
    ProjectDiscussionGuard,
    ProjectNavigationService,
    ProjectRedirectGuard,
    ProjectResourceGuard,
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
    ProjectCategoryDialogComponent,
    ProjectDisciplinesPageComponent,
    ProjectDiscussionLayoutComponent,
    ProjectDiscussionListPageComponent,
    ProjectDiscussionWritePageComponent,
    ProjectPhasesComponent,
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
