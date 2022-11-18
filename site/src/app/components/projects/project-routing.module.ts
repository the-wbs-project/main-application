import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'list',
    loadChildren: () =>
      import('./pages/project-list/project-list.module').then(
        (m) => m.ProjectListModule
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
    path: ':projectId/view',
    loadChildren: () =>
      import('./pages/project-view/project-view.module').then(
        (m) => m.ProjectViewModule
      ),
  },
  {
    path: ':projectId/task/:taskId',
    loadChildren: () =>
      import('./pages/task-view/task-view.module').then(
        (m) => m.TaskViewModule
      ),
  },
  {
    path: ':projectId/upload',
    loadChildren: () =>
      import('./pages/project-upload/project-upload.module').then(
        (m) => m.ProjectUploadModule
      ),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProjectRoutingModule {}
