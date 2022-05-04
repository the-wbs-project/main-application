import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NgxsModule } from '@ngxs/store';
import { SharedModule } from '@wbs/shared/module';
import { ProjectLayoutComponent } from './project-layout.component';
import { ProjectState } from './states';

export const routes: Routes = [
  {
    path: '',
    component: ProjectLayoutComponent,
    children: [
      {
        path: 'view',
        loadChildren: () =>
          import('./pages/view/module').then((m) => m.ProjectsViewModule),
      },
    ],
  },
];

@NgModule({
  imports: [
    NgxsModule.forFeature([ProjectState]),
    RouterModule.forChild(routes),
    SharedModule,
  ],
  providers: [],
  declarations: [ProjectLayoutComponent],
})
export class ProjectsLayoutModule {}
