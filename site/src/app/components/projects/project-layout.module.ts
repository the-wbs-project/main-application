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
        path: 'list',
        loadChildren: () =>
          import('./pages/project-list/project-list.module').then(
            (m) => m.ProjectListModule
          ),
      },
      {
        path: ':projectId/view',
        loadChildren: () =>
          import('./pages/project-view/project-view.module').then(
            (m) => m.ProjectView2Module
          ),
      },
      {
        path: 'create',
        loadChildren: () =>
          import('./pages/project-create/project-create.module').then(
            (m) => m.ProjectCreateModule
          ),
      },
      {
        path: ':projectId/task/:taskId',
        loadChildren: () =>
          import('./pages/task-view/task-view.module').then(
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
