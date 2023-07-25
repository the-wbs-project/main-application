import { Routes } from '@angular/router';
import { ProjectUploadGuard } from '../guards';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'start',
        //  canActivate: [StartGuard],
        //loadComponent: () =>
        //    import('./start-view/start-view.component').then(({ StartViewComponent }) => StartViewComponent),
    },
    {
        path: 'start',
        canActivate: [ProjectUploadGuard],
        data: {
            title: 'ProjectUpload.PagesUploadProjectPlan',
        },
        loadComponent: () =>
            import('./start-view/start-view.component').then(({ StartViewComponent }) => StartViewComponent),
    },
    {
        path: 'results',
        canActivate: [ProjectUploadGuard],
        data: {
            title: 'ProjectUpload.PagesUploadProjectPlan',
        },
        loadComponent: () =>
            import('./results-view/results-view.component').then(({ ResultsViewComponent }) => ResultsViewComponent),
    },
    {
        path: 'options',
        canActivate: [ProjectUploadGuard],
        data: {
            title: 'ProjectUpload.PagesOptions',
        },
        loadComponent: () =>
            import('./options-view/options-view.component').then(({ OptionsViewComponent }) => OptionsViewComponent),
    },
    {
        path: 'phases',
        canActivate: [ProjectUploadGuard],
        data: {
            title: 'ProjectUpload.PagesUploadProjectPlan',
        },
        loadComponent: () =>
            import('./phase-view/phase-view.component').then(({ PhaseViewComponent }) => PhaseViewComponent),
    },
    {
        path: 'disciplines',
        canActivate: [ProjectUploadGuard],
        data: {
            title: 'ProjectUpload.PagesUploadProjectPlan',
        },
        loadComponent: () =>
            import('./disciplines-view/disciplines-view.component').then(({ DisciplinesViewComponent }) => DisciplinesViewComponent),
    },
    {
        path: 'saving',
        canActivate: [ProjectUploadGuard],
        data: {
            title: 'ProjectUpload.PagesUploadProjectPlan',
        },
        loadComponent: () =>
            import('./save-view/save-view.component').then(({ SaveViewComponent }) => SaveViewComponent),
    },
];
