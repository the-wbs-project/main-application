import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, Routes } from '@angular/router';
import { Navigate } from '@ngxs/router-plugin';
import { Store } from '@ngxs/store';
import { map } from 'rxjs/operators';
import { ProjectUploadState } from '../states';
import { SetAsStarted, SetPageTitle } from '../actions';

export const projectUploadGuard = (route: ActivatedRouteSnapshot) => {
    const store = inject(Store);
    const title = route.data['title'];
    const validateStart = route.data['validateStart'] === true;
    const setStart = route.data['setStart'] === true;
  
    if (validateStart) {
      const started = store.selectSnapshot(ProjectUploadState.started);
  
      if (!started) {
        const projectId = store.selectSnapshot(
          ProjectUploadState.current
        )!.id;
        return store
          .dispatch(new Navigate(['/projects', projectId, 'upload', 'start']))
          .pipe(map(() => false));
      }
    }
    const dispatch: any[] = [new SetPageTitle(title)];
  
    if (setStart) dispatch.push(new SetAsStarted());
  
    return store.dispatch(dispatch).pipe(map(() => true));
  }
  
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
        canActivate: [projectUploadGuard],
        data: {
            title: 'ProjectUpload.PagesUploadProjectPlan',
        },
        loadComponent: () =>
            import('./start-view/start-view.component').then(({ StartViewComponent }) => StartViewComponent),
    },
    {
        path: 'results',
        canActivate: [projectUploadGuard],
        data: {
            title: 'ProjectUpload.PagesUploadProjectPlan',
        },
        loadComponent: () =>
            import('./results-view/results-view.component').then(({ ResultsViewComponent }) => ResultsViewComponent),
    },
    {
        path: 'options',
        canActivate: [projectUploadGuard],
        data: {
            title: 'ProjectUpload.PagesOptions',
        },
        loadComponent: () =>
            import('./options-view/options-view.component').then(({ OptionsViewComponent }) => OptionsViewComponent),
    },
    {
        path: 'phases',
        canActivate: [projectUploadGuard],
        data: {
            title: 'ProjectUpload.PagesUploadProjectPlan',
        },
        loadComponent: () =>
            import('./phase-view/phase-view.component').then(({ PhaseViewComponent }) => PhaseViewComponent),
    },
    {
        path: 'disciplines',
        canActivate: [projectUploadGuard],
        data: {
            title: 'ProjectUpload.PagesUploadProjectPlan',
        },
        loadComponent: () =>
            import('./disciplines-view/disciplines-view.component').then(({ DisciplinesViewComponent }) => DisciplinesViewComponent),
    },
    {
        path: 'saving',
        canActivate: [projectUploadGuard],
        data: {
            title: 'ProjectUpload.PagesUploadProjectPlan',
        },
        loadComponent: () =>
            import('./save-view/save-view.component').then(({ SaveViewComponent }) => SaveViewComponent),
    },
];
