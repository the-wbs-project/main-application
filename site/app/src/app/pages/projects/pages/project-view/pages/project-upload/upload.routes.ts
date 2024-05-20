import { Component, importProvidersFrom } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NgxsModule } from '@ngxs/store';
import {
  disciplineListResolver,
  setupGuard,
  startGuard,
  startPageGuard,
  verifyGuard,
  verifyStartedGuard,
} from './services';
import { ProjectUploadState } from './states';
import { projectUrlResolve } from '../../services';

@Component({
  standalone: true,
  template: '<router-outlet />',
  imports: [RouterModule],
})
export class LayoutComponent {}

export const routes: Routes = [
  {
    path: '',
    canActivate: [verifyGuard, startGuard],
    component: LayoutComponent,
    providers: [
      importProvidersFrom(NgxsModule.forFeature([ProjectUploadState])),
    ],
    children: [
      { path: '', redirectTo: 'start', pathMatch: 'full' },
      {
        path: 'start',
        canActivate: [startPageGuard, setupGuard],
        data: {
          title: 'ProjectUpload.Page_LetsGetStarted',
        },
        loadComponent: () =>
          import('./pages/start-view.component').then(
            (x) => x.StartViewComponent
          ),
      },
      {
        path: 'results',
        canActivate: [verifyStartedGuard, setupGuard],
        data: {
          title: 'ProjectUpload.Page_UploadResults',
        },
        loadComponent: () =>
          import('./pages/results-view.component').then(
            (x) => x.ResultsViewComponent
          ),
      },
      {
        path: 'options',
        canActivate: [verifyStartedGuard, setupGuard],
        data: {
          title: 'ProjectUpload.Page_Options',
        },
        loadComponent: () =>
          import('./pages/options-view.component').then(
            (x) => x.OptionsViewComponent
          ),
      },
      {
        path: 'disciplines',
        canActivate: [verifyStartedGuard, setupGuard],
        data: {
          title: 'ProjectUpload.Page_Disciplines',
        },
        resolve: {
          disciplines: disciplineListResolver,
        },
        loadComponent: () =>
          import('./pages/disciplines-view.component').then(
            (x) => x.DisciplinesViewComponent
          ),
      },
      {
        path: 'saving',
        canActivate: [verifyStartedGuard, setupGuard],
        data: {
          title: 'ProjectUpload.Page_Saving',
        },
        loadComponent: () =>
          import('./pages/save-view.component').then(
            (x) => x.SaveViewComponent
          ),
        resolve: {
          projectUrl: projectUrlResolve,
        },
      },
      {
        path: 'ticket/:reasonCode',
        canActivate: [verifyStartedGuard, setupGuard],
        data: {
          title: 'ProjectUpload.Page_Ticket',
        },
        loadComponent: () =>
          import('./pages/ticket-view/ticket-view.component').then(
            (x) => x.TicketViewComponent
          ),
      },
    ],
  },
];
