import { NgModule } from '@angular/core';
import {
  NgbAccordionModule,
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
import {
  ProjectChecklistComponent,
  ProjectChecklistModalComponent,
  ProjectNavigationComponent,
  TaskModalComponent,
  Timeline1Component,
} from './components';
import {
  ProjectDiscussionGuard,
  ProjectRedirectGuard,
  ProjectTimelineVerifyGuard,
  ProjectVerifyGuard,
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
  ChecklistResultClassPipe,
  ChecklistResultIconPipe,
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
  ChecklistDataService,
  PhaseExtractProcessor,
  ProjectNavigationService,
  ProjectViewService,
  TextCompareService,
  UploadFileService,
} from './services';
import {
  ProjectChecklistState,
  ProjectState,
  ProjectTimelineState,
  ProjectViewState,
  TasksState,
} from './states';

@NgModule({
  imports: [
    ButtonModule,
    NgbAccordionModule,
    NgbDropdownModule,
    NgbNavModule,
    NgbTooltipModule,
    NgxsModule.forFeature([
      ProjectState,
      ProjectChecklistState,
      ProjectTimelineState,
      ProjectViewState,
      TasksState,
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
    ChecklistDataService,
    PhaseExtractProcessor,
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
    ChecklistResultClassPipe,
    ChecklistResultIconPipe,
    ProjectAboutPageComponent,
    ProjectChecklistComponent,
    ProjectChecklistModalComponent,
    ProjectDisciplinesPageComponent,
    ProjectNavigationComponent,
    ProjectPhasesPageComponent,
    ProjectTimelinePageComponent,
    ProjectViewLayoutComponent,
    RoleIconPipe,
    RoleTitlePipe,
    TaskAboutComponent,
    TaskDetailsActionsPipe,
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
