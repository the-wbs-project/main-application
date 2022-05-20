import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProjectLayoutComponent } from './project-layout.component';

export const routes: Routes = [
  {
    path: '',
    component: ProjectLayoutComponent,
    children: [
      {
        path: 'view',
        loadChildren: () =>
          import('./pages/view/project-view.module').then(
            (m) => m.ProjectViewModule
          ),
      },
      {
        path: 'create',
        loadChildren: () =>
          import('./pages/create/project-create.module').then(
            (m) => m.ProjectCreateModule
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
