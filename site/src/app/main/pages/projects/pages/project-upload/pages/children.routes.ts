import { Routes } from '@angular/router';
import { setupGuard, startGuard, verifyStartedGuard } from './children.guards';

export const routes: Routes = [
  { path: '', redirectTo: 'start', pathMatch: 'full' },
  {
    path: 'start',
    canActivate: [startGuard, setupGuard],
    data: {
      title: 'ProjectUpload.Page_LetsGetStarted',
    },
    loadComponent: () =>
      import('./start-view/start-view.component').then(
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
      import('./results-view/results-view.component').then(
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
      import('./options-view/options-view.component').then(
        (x) => x.OptionsViewComponent
      ),
  },
  {
    path: 'phases',
    canActivate: [verifyStartedGuard, setupGuard],
    data: {
      title: 'ProjectUpload.Page_Phases',
    },
    loadComponent: () =>
      import('./phase-view/phase-view.component').then(
        (x) => x.PhaseViewComponent
      ),
  },
  {
    path: 'disciplines',
    canActivate: [verifyStartedGuard, setupGuard],
    data: {
      title: 'ProjectUpload.Page_Disciplines',
    },
    loadComponent: () =>
      import('./disciplines-view/disciplines-view.component').then(
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
      import('./save-view/save-view.component').then(
        (x) => x.SaveViewComponent
      ),
  },
  {
    path: 'ticket/:reasonCode',
    canActivate: [verifyStartedGuard, setupGuard],
    data: {
      title: 'ProjectUpload.Page_Ticket',
    },
    loadComponent: () =>
      import('./ticket-view/ticket-view.component').then(
        (x) => x.TicketViewComponent
      ),
  },
];
