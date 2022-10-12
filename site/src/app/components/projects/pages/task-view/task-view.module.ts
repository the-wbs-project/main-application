import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NgxsModule } from '@ngxs/store';
import { ButtonModule } from '@progress/kendo-angular-buttons';
import { TextBoxModule } from '@progress/kendo-angular-inputs';
import {
  ProjectResourceGuard,
  ProjectVerifyGuard,
} from '@wbs/components/projects/guards';
import { TimelineModule, WbsTreeModule } from '@wbs/components/_features';
import { SharedModule } from '@wbs/shared/module';
import { ProjectComponentModule } from '../../components';
import { TaskSubTasksComponent } from './components';
import { TaskAboutComponent } from './components/task-about/task-about.component';
import { TaskRedirectGuard, TaskVerifyGuard, TaskViewGuard } from './guards';
import { TaskViewComponent } from './task-view.component';
import { TaskViewState } from './task-view.state';

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
      TaskVerifyGuard,
      TaskViewGuard,
    ],
  },
];

@NgModule({
  imports: [
    ButtonModule,
    NgxsModule.forFeature([TaskViewState]),
    ProjectComponentModule,
    RouterModule.forChild(routes),
    SharedModule,
    TextBoxModule,
    TimelineModule,
    WbsTreeModule,
  ],
  providers: [TaskRedirectGuard, TaskVerifyGuard, TaskViewGuard],
  declarations: [TaskAboutComponent, TaskSubTasksComponent, TaskViewComponent],
})
export class TaskViewModule {}
