import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NgxsModule } from '@ngxs/store';
import { SharedModule } from '@wbs/shared/module';
import { WbsNodeDeleteModule } from '../_features';
import { ProjectResourceGuard, ProjectVerifyGuard } from './guards';
import { ProjectLayoutComponent } from './project-layout.component';
import { ProjectState } from './states';

export const routes: Routes = [
  {
    path: '',
    component: ProjectLayoutComponent,
    children: [
      {
        path: ':projectId/view',
        loadChildren: () =>
          import('./pages/view2/project-view.module').then(
            (m) => m.ProjectView2Module
          ),
      },
      {
        path: 'create',
        loadChildren: () =>
          import('./pages/create/project-create.module').then(
            (m) => m.ProjectCreateModule
          ),
      },
      {
        path: ':projectId/task/:taskId',
        loadChildren: () =>
          import('./pages/tasks/view/task-view.module').then(
            (m) => m.TaskViewModule
          ),
      },
    ],
  },
];

@NgModule({
  imports: [
    NgxsModule.forFeature([ProjectState]),
    RouterModule.forChild(routes),
    SharedModule,
    WbsNodeDeleteModule,
  ],
  providers: [ProjectResourceGuard, ProjectVerifyGuard],
  declarations: [ProjectLayoutComponent],
})
export class ProjectsLayoutModule {}
