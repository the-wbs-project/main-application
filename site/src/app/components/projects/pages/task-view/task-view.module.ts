import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxsModule } from '@ngxs/store';
import { ButtonModule } from '@progress/kendo-angular-buttons';
import { TextBoxModule } from '@progress/kendo-angular-inputs';
import {
  ProjectResourceGuard,
  ProjectTimelineVerifyGuard,
  ProjectVerifyGuard,
} from '@wbs/components/projects/guards';
import { TaskDeleteModule } from '@wbs/components/_features/task-delete';
import { TimelineModule } from '@wbs/components/_features/timeline';
import { WbsTreeModule } from '@wbs/components/_features/wbs-tree';
import { SharedModule } from '@wbs/shared/module';
import { ProjectComponentModule } from '../../components';
import { TaskSubTasksComponent } from './components';
import { TaskAboutComponent } from './components/task-about/task-about.component';
import { TaskRedirectGuard, TaskVerifyGuard, TaskViewGuard } from './guards';
import { TaskViewComponent } from './task-view.component';

const routes: Routes = [
  {
    path: '',
    component: TaskViewComponent,
    canActivate: [TaskRedirectGuard],
  },
  {
    path: ':view',
    component: TaskViewComponent,
    canActivate: [
      ProjectResourceGuard,
      ProjectVerifyGuard,
      ProjectTimelineVerifyGuard,
      TaskVerifyGuard,
      TaskViewGuard,
    ],
  },
];

@NgModule({
  imports: [
    ButtonModule,
    NgbNavModule,
    ProjectComponentModule,
    RouterModule.forChild(routes),
    SharedModule,
    TaskDeleteModule,
    TextBoxModule,
    TimelineModule,
    WbsTreeModule,
  ],
  providers: [
    ProjectResourceGuard,
    ProjectTimelineVerifyGuard,
    ProjectVerifyGuard,
    TaskRedirectGuard,
    TaskVerifyGuard,
    TaskViewGuard,
  ],
  declarations: [TaskAboutComponent, TaskSubTasksComponent, TaskViewComponent],
})
export class TaskViewModule {}
