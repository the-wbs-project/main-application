import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {
  ProjectUploadGuard,
  ProjectUploadVerifyGuard,
  StartGuard,
} from './guards';
import {
  DisciplinesViewComponent,
  OptionsViewComponent,
  PhaseViewComponent,
  ResultsViewComponent,
  SaveViewComponent,
  StartViewComponent,
} from './pages';
import { ProjectUploadLayoutComponent } from './project-upload-layout.component';

export const routes: Routes = [
  {
    path: ':projectId',
    component: ProjectUploadLayoutComponent,
    canActivate: [ProjectUploadVerifyGuard],
    children: [
      {
        path: '',
        component: StartViewComponent,
        canActivate: [StartGuard],
      },
      {
        path: 'start',
        component: StartViewComponent,
        canActivate: [ProjectUploadGuard],
        data: {
          title: 'ProjectUpload.PagesUploadProjectPlan',
        },
      },
      {
        path: 'results',
        component: ResultsViewComponent,
        canActivate: [ProjectUploadGuard],
        data: {
          title: 'ProjectUpload.PagesUploadProjectPlan',
        },
      },
      {
        path: 'options',
        component: OptionsViewComponent,
        canActivate: [ProjectUploadGuard],
        data: {
          title: 'ProjectUpload.PagesOptions',
        },
      },
      {
        path: 'phases',
        component: PhaseViewComponent,
        canActivate: [ProjectUploadGuard],
        data: {
          title: 'ProjectUpload.PagesUploadProjectPlan',
        },
      },
      {
        path: 'disciplines',
        component: DisciplinesViewComponent,
        canActivate: [ProjectUploadGuard],
        data: {
          title: 'ProjectUpload.PagesUploadProjectPlan',
        },
      },
      {
        path: 'saving',
        component: SaveViewComponent,
        canActivate: [ProjectUploadGuard],
        data: {
          title: 'ProjectUpload.PagesUploadProjectPlan',
        },
      },
      {
        path: 'validate',
        component: StartViewComponent,
        canActivate: [ProjectUploadGuard],
        data: {
          title: 'Projects.UploadProjectPlan',
        },
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProjectUploadRoutingModule {}
