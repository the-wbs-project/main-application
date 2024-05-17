import { inject } from '@angular/core';
import { ActivatedRouteSnapshot } from '@angular/router';
import { Navigate } from '@ngxs/router-plugin';
import { Store } from '@ngxs/store';
import { DataServiceFactory } from '@wbs/core/data-services';
import { PROJECT_CLAIMS, Project } from '@wbs/core/models';
import { UiStore } from '@wbs/core/store';
import { Observable, of } from 'rxjs';
import { first, map, skipWhile, switchMap, tap } from 'rxjs/operators';
import { ProjectState } from '../../../states';
import { SetAsStarted, SetProject } from '../actions';
import { ProjectUploadState } from '../states';

function getProject(store: Store): Observable<Project> {
  return store.select(ProjectState.current).pipe(
    skipWhile((x) => x == undefined),
    map((x) => x!),
    first()
  );
}

function redirect(store: Store) {
  return store.selectOnce(ProjectUploadState.current).pipe(
    map((p) => p!),
    tap((p) =>
      store.dispatch(
        new Navigate([
          '/' + p.owner,
          'projects',
          'view',
          p.id,
          'upload',
          'start',
        ])
      )
    ),
    map(() => true)
  );
}

export const verifyGuard = () => {
  const store = inject(Store);
  const data = inject(DataServiceFactory);

  return getProject(store).pipe(
    switchMap((p) => data.claims.getProjectClaimsAsync(p.owner, p.id)),
    map((claims) => claims.includes(PROJECT_CLAIMS.TASKS.UPDATE))
  );
};

export const startGuard = () => {
  const store = inject(Store);
  return getProject(store).pipe(
    switchMap((project) => store.dispatch(new SetProject(project))),
    map(() => true)
  );
};

export const verifyStartedGuard = () => {
  const store = inject(Store);

  return store
    .selectOnce(ProjectUploadState.started)
    .pipe(switchMap((started) => (started ? of(true) : redirect(store))));
};

export const startPageGuard = () =>
  inject(Store)
    .dispatch(new SetAsStarted())
    .pipe(map(() => true));

export const setupGuard = (route: ActivatedRouteSnapshot) => {
  const store = inject(Store);
  const uiStore = inject(UiStore);

  return store.selectOnce(ProjectUploadState.current).pipe(
    map((p) => p!),
    tap((project) => {
      uiStore.setBreadcrumbs([
        {
          route: ['/', project.owner, 'projects'],
          text: 'General.Projects',
        },
        {
          route: ['/', project.owner, 'projects', 'view', project.id],
          text: project.title,
          isText: true,
        },
        {
          route: ['/', project.owner, 'projects', 'upload', project.id],
          text: 'General.Upload',
        },
        {
          text: route.data['title'],
        },
      ]);
    })
  );
};
