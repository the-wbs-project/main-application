import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProjectLayoutComponent } from './project-layout.component';

export const routes: Routes = [
  {
    path: '',
    component: ProjectLayoutComponent,
    children: [
      {
        path: ':projectId/view-old',
        loadChildren: () =>
          import('./pages/view/project-view.module').then(
            (m) => m.ProjectViewModule
          ),
      },
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
  imports: [RouterModule.forChild(routes)],
  declarations: [ProjectLayoutComponent],
})
export class ProjectsLayoutModule {}
