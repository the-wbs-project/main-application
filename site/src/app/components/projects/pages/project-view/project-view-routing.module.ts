import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {
  ProjectResourceGuard,
  ProjectTimelineVerifyGuard,
  ProjectVerifyGuard,
} from '../../guards';
import { ProjectRedirectGuard, ProjectViewGuard } from './guards';
import { PAGE_VIEW } from './models';
import {
  ProjectAboutPageComponent,
  ProjectDisciplinesPageComponent,
  ProjectPhasesPageComponent,
  ProjectTimelinePageComponent,
} from './pages';
import { ProjectViewLayoutComponent } from './project-view-layout.component';

export const routes: Routes = [
  {
    path: '',
    component: ProjectViewLayoutComponent,
    canActivate: [ProjectResourceGuard, ProjectVerifyGuard],
    children: [
      {
        path: '',
        component: ProjectAboutPageComponent,
        canActivate: [ProjectRedirectGuard],
      },
      {
        path: 'about',
        component: ProjectAboutPageComponent,
        canActivate: [ProjectViewGuard],
        data: {
          title: 'ProjectUpload.PagesUploadProjectPlan',
          view: PAGE_VIEW.ABOUT,
        },
      },
      {
        path: 'phases',
        component: ProjectPhasesPageComponent,
        canActivate: [ProjectViewGuard],
        data: {
          title: 'ProjectUpload.PagesUploadProjectPlan',
          view: PAGE_VIEW.PHASES,
        },
      },
      {
        path: 'disciplines',
        component: ProjectDisciplinesPageComponent,
        canActivate: [ProjectViewGuard],
        data: {
          title: 'ProjectUpload.PagesUploadProjectPlan',
          view: PAGE_VIEW.DISCIPLINES,
        },
      },
      {
        path: 'timeline',
        component: ProjectTimelinePageComponent,
        canActivate: [ProjectViewGuard, ProjectTimelineVerifyGuard],
        data: {
          title: 'ProjectUpload.PagesUploadProjectPlan',
          view: PAGE_VIEW.TIMELINE,
        },
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProjectViewRoutingModule {}
