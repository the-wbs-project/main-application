import { importProvidersFrom, inject } from '@angular/core';
import { Routes } from '@angular/router';
import { NgxsModule, Store } from '@ngxs/store';
import { DataServiceFactory } from '@wbs/core/data-services';
import { PROJECT_CLAIMS, Project } from '@wbs/core/models';
import { Transformers, WbsNodeService } from '@wbs/main/services';
import { Observable } from 'rxjs';
import { first, map, skipWhile, switchMap } from 'rxjs/operators';
import { ProjectState } from '../../../states';
import { SetProject } from './actions';
import { ProjectUploadState } from './states';

function getProject(store: Store): Observable<Project> {
  return store.select(ProjectState.current).pipe(
    skipWhile((x) => x == undefined),
    map((x) => x!),
    first()
  );
}

const verifyGuard = () => {
  const store = inject(Store);
  const data = inject(DataServiceFactory);

  return getProject(store).pipe(
    switchMap((p) => data.claims.getProjectClaimsAsync(p.owner, p.id)),
    map((claims) => claims.includes(PROJECT_CLAIMS.TASKS.UPDATE))
  );
};

const startGuard = () => {
  const store = inject(Store);
  return getProject(store).pipe(
    switchMap((project) => store.dispatch(new SetProject(project))),
    map(() => true)
  );
};

export const routes: Routes = [
  {
    path: '',
    canActivate: [verifyGuard, startGuard],
    loadComponent: () =>
      import('./upload-layout.component').then(
        (x) => x.ProjectUploadLayoutComponent
      ),

    loadChildren: () =>
      import('./pages/children.routes').then(({ routes }) => routes),

    providers: [
      importProvidersFrom(NgxsModule.forFeature([ProjectUploadState])),
      Transformers,
      WbsNodeService,
    ],
  },
];
