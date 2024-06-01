import { Routes } from '@angular/router';
import { entryUrlResolve } from '../../../services';
import { disciplineListResolver } from '../services';
import { setupGuard, startGuard, verifyStartedGuard } from './children.guards';

export const routes: Routes = [
  { path: '', redirectTo: 'start', pathMatch: 'full' },
  {
    path: 'start',
    loadComponent: () =>
      import('./start-view.component').then((x) => x.StartViewComponent),
    canActivate: [startGuard, setupGuard],
    data: {
      title: 'ProjectUpload.Page_LetsGetStarted',
    },
  },
  {
    path: 'results',
    loadComponent: () =>
      import('./results-view.component').then((x) => x.ResultsViewComponent),
    canActivate: [verifyStartedGuard, setupGuard],
    data: {
      title: 'ProjectUpload.Page_UploadResults',
    },
  },
  {
    path: 'options',
    loadComponent: () =>
      import('./options-view.component').then((x) => x.OptionsViewComponent),
    canActivate: [verifyStartedGuard, setupGuard],
    data: {
      title: 'ProjectUpload.Page_Options',
    },
    resolve: {
      entryUrl: entryUrlResolve,
    },
  },
  {
    path: 'disciplines',
    loadComponent: () =>
      import('./disciplines-view.component').then(
        (x) => x.DisciplinesViewComponent
      ),
    canActivate: [verifyStartedGuard, setupGuard],
    data: {
      title: 'ProjectUpload.Page_Disciplines',
    },
    resolve: {
      disciplines: disciplineListResolver,
    },
  },
  {
    path: 'saving',
    loadComponent: () =>
      import('./save-view.component').then((x) => x.SaveViewComponent),
    canActivate: [verifyStartedGuard, setupGuard],
    data: {
      title: 'ProjectUpload.Page_Saving',
    },
    resolve: {
      entryUrl: entryUrlResolve,
    },
  },
  {
    path: 'ticket/:reasonCode',
    loadComponent: () =>
      import('./ticket-view').then((x) => x.TicketViewComponent),
    canActivate: [verifyStartedGuard, setupGuard],
    data: {
      title: 'ProjectUpload.Page_Ticket',
    },
  },
];
