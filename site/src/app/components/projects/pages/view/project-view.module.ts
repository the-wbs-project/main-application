import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ButtonModule } from '@progress/kendo-angular-buttons';
import { IconModule } from '@progress/kendo-angular-icons';
import { ContextMenuModule } from '@progress/kendo-angular-menu';
import { SplitterModule } from '@progress/kendo-angular-layout';
import { SharedModule } from '@wbs/shared/module';
import {
  WbsNodeCreateModule,
  WbsNodeDeleteModule,
  WbsNodeEditorModule,
  WbsTreeModule,
} from '../../../_features';
import { ProjectGuard, ProjectViewGuard } from './guards';
import { ProjectsViewComponent } from './project-view.component';
import {
  ProjectNodeUploadDialogComponent,
  ProjectViewActionsComponent,
} from './components';
import {
  PhaseExtractProcessor,
  TextCompareService,
  UploadFileService,
} from './services';
import { FileSelectModule, UploadModule } from '@progress/kendo-angular-upload';
import { NgxsModule } from '@ngxs/store';
import { ProjectViewState } from './project-view.state';

const routes: Routes = [
  {
    path: ':projectId',
    component: ProjectsViewComponent,
    canActivate: [ProjectGuard, ProjectViewGuard],
  },
  {
    path: ':projectId/:view',
    component: ProjectsViewComponent,
    canActivate: [ProjectGuard, ProjectViewGuard],
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
    SplitterModule,
    UploadModule,
    WbsNodeCreateModule,
    WbsNodeDeleteModule,
    WbsNodeEditorModule,
    WbsTreeModule,
  ],
  providers: [
    PhaseExtractProcessor,
    ProjectGuard,
    ProjectViewGuard,
    TextCompareService,
    UploadFileService,
  ],
  declarations: [
    ProjectNodeUploadDialogComponent,
    ProjectsViewComponent,
    ProjectViewActionsComponent,
  ],
})
export class ProjectViewModule {}
