import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {
  ProjectResourceGuard,
  ProjectTimelineVerifyGuard,
  ProjectVerifyGuard,
} from '../../guards';
import {
  ProjectDiscussionGuard,
  ProjectRedirectGuard,
  ProjectViewGuard,
  TaskVerifyGuard,
  TaskViewGuard,
} from './guards';
import { PROJECT_PAGE_VIEW, TASK_PAGE_VIEW } from './models';
import {
  ProjectAboutPageComponent,
  ProjectDisciplinesPageComponent,
  ProjectDiscussionLayoutComponent,
  ProjectDiscussionListPageComponent,
  ProjectDiscussionWritePageComponent,
  ProjectPhasesPageComponent,
  ProjectTimelinePageComponent,
  TaskAboutComponent,
  TaskSubTasksComponent,
  TaskTestComponent,
  TaskViewComponent,
} from './pages';
import { ProjectViewLayoutComponent } from './project-view-layout.component';

export const routes: Routes = [
  {
    path: '',
    component: ProjectViewLayoutComponent,
    canActivate: [
      ProjectResourceGuard,
      ProjectVerifyGuard,
      ProjectTimelineVerifyGuard,
    ],
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
          view: PROJECT_PAGE_VIEW.ABOUT,
        },
      },
      {
        path: 'phases',
        component: ProjectPhasesPageComponent,
        canActivate: [ProjectViewGuard],
        data: {
          title: 'ProjectUpload.PagesUploadProjectPlan',
          view: PROJECT_PAGE_VIEW.PHASES,
        },
        children: [
          {
            path: 'task/:taskId',
            component: TaskViewComponent,
            canActivate: [TaskVerifyGuard],
            data: {
              title: 'ProjectUpload.PagesUploadProjectPlan',
            },
            children: [
              {
                path: 'about',
                component: TaskAboutComponent,
                canActivate: [TaskViewGuard],
                data: {
                  title: 'ProjectUpload.PagesUploadProjectPlan',
                  view: TASK_PAGE_VIEW.ABOUT,
                },
              },
              {
                path: 'sub-tasks',
                component: TaskSubTasksComponent,
                canActivate: [TaskViewGuard],
                data: {
                  title: 'ProjectUpload.PagesUploadProjectPlan',
                  view: TASK_PAGE_VIEW.SUB_TASKS,
                },
              },
            ],
          },
        ],
      },
      {
        path: 'disciplines',
        component: ProjectDisciplinesPageComponent,
        canActivate: [ProjectViewGuard],
        data: {
          title: 'ProjectUpload.PagesUploadProjectPlan',
          view: PROJECT_PAGE_VIEW.DISCIPLINES,
        },
      },
      {
        path: 'timeline',
        component: ProjectTimelinePageComponent,
        canActivate: [ProjectViewGuard],
        data: {
          title: 'ProjectUpload.PagesUploadProjectPlan',
          view: PROJECT_PAGE_VIEW.TIMELINE,
        },
      },
      {
        path: 'discussions',
        component: ProjectDiscussionLayoutComponent,
        canActivate: [ProjectViewGuard, ProjectDiscussionGuard],
        children: [
          {
            path: '',
            component: ProjectDiscussionListPageComponent,
            data: {
              title: 'ProjectUpload.PagesUploadProjectPlan',
              view: PROJECT_PAGE_VIEW.DISCUSSIONS,
            },
          },
          {
            path: 'write',
            component: ProjectDiscussionWritePageComponent,
            data: {
              title: 'ProjectUpload.PagesUploadProjectPlan',
              view: PROJECT_PAGE_VIEW.DISCUSSIONS,
            },
          },
          {
            path: 'write/:replyToId',
            component: ProjectDiscussionWritePageComponent,
            data: {
              title: 'ProjectUpload.PagesUploadProjectPlan',
              view: PROJECT_PAGE_VIEW.DISCUSSIONS,
            },
          },
        ],
      },
      {
        path: 'task/:taskId/:view',
        component: TaskViewComponent,
        canActivate: [TaskVerifyGuard, TaskViewGuard],
        data: {
          title: 'ProjectUpload.PagesUploadProjectPlan',
          view: PROJECT_PAGE_VIEW.TIMELINE,
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
