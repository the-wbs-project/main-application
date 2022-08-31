import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NgxsModule } from '@ngxs/store';
import { IconModule } from '@progress/kendo-angular-icons';
import { ContextMenuModule } from '@progress/kendo-angular-menu';
import {
  ProjectResourceGuard,
  ProjectVerifyGuard,
} from '@wbs/components/projects/guards';
import { WbsTreeModule } from '@wbs/components/_features';
import { SharedModule } from '@wbs/shared/module';
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
    canActivate: [ProjectResourceGuard, TaskVerifyGuard, TaskViewGuard],
  },
];

@NgModule({
  imports: [
    ContextMenuModule,
    IconModule,
    NgxsModule.forFeature([TaskViewState]),
    RouterModule.forChild(routes),
    SharedModule,
    WbsTreeModule,
  ],
  providers: [TaskRedirectGuard, TaskVerifyGuard, TaskViewGuard],
  declarations: [TaskAboutComponent, TaskSubTasksComponent, TaskViewComponent],
})
export class TaskViewModule {}
