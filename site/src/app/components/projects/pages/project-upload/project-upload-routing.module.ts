import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProjectResourceGuard, ProjectVerifyGuard } from '../../guards';
import { ProjectUploadGuard, StartGuard } from './guards';
import {
  DisciplinesViewComponent,
  OptionsViewComponent,
  PhaseViewComponent,
  ProjectViewComponent,
  SaveViewComponent,
  StartViewComponent,
} from './pages';
import { ProjectUploadLayoutComponent } from './project-upload-layout.component';

export const routes: Routes = [
  {
    path: '',
    component: ProjectUploadLayoutComponent,
    canActivate: [ProjectResourceGuard, ProjectVerifyGuard],
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
          validateStart: false,
          setStart: true,
        },
      },
      {
        path: 'project',
        component: ProjectViewComponent,
        canActivate: [ProjectUploadGuard],
        data: {
          title: 'ProjectUpload.PagesUploadProjectPlan',
          validateStart: true,
        },
      },
      {
        path: 'options',
        component: OptionsViewComponent,
        canActivate: [ProjectUploadGuard],
        data: {
          title: 'ProjectUpload.PagesOptions',
          validateStart: true,
        },
      },
      {
        path: 'phases',
        component: PhaseViewComponent,
        canActivate: [ProjectUploadGuard],
        data: {
          title: 'ProjectUpload.PagesUploadProjectPlan',
          validateStart: true,
        },
      },
      {
        path: 'disciplines',
        component: DisciplinesViewComponent,
        canActivate: [ProjectUploadGuard],
        data: {
          title: 'ProjectUpload.PagesUploadProjectPlan',
          validateStart: true,
        },
      },
      {
        path: 'saving',
        component: SaveViewComponent,
        canActivate: [ProjectUploadGuard],
        data: {
          title: 'ProjectUpload.PagesUploadProjectPlan',
          validateStart: true,
        },
      },
      {
        path: 'validate',
        component: StartViewComponent,
        canActivate: [ProjectUploadGuard],
        data: {
          title: 'Projects.UploadProjectPlan',
          validateStart: true,
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
