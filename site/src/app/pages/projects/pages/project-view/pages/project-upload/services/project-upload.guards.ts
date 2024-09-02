import { inject } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { ActivatedRouteSnapshot } from '@angular/router';
import { Navigate } from '@ngxs/router-plugin';
import { Store } from '@ngxs/store';
import { PROJECT_CLAIMS } from '@wbs/core/models';
import { UiStore } from '@wbs/core/store';
import { ProjectViewModel } from '@wbs/core/view-models';
import { Observable, of } from 'rxjs';
import { first, map, skipWhile, switchMap } from 'rxjs/operators';
import { ProjectStore } from '../../../stores';
import { SetAsStarted, SetProject } from '../actions';
import { ProjectUploadState } from '../states';

function getProject(store: ProjectStore): Observable<ProjectViewModel> {
  return toObservable(store.project).pipe(
    skipWhile((x) => x == undefined),
    map((x) => x!),
    first()
  );
}

function redirect(projectStore: ProjectStore, store: Store) {
  const p = projectStore.project()!;

  return store.dispatch(
    new Navigate(['/' + p.owner, 'projects', 'view', p.id, 'upload', 'start'])
  );
}

export const verifyGuard = () =>
  inject(ProjectStore).claims().includes(PROJECT_CLAIMS.TASKS.UPDATE);

export const startGuard = () => {
  const pStore = inject(ProjectStore);
  const store = inject(Store);

  return getProject(pStore).pipe(
    switchMap((project) => store.dispatch(new SetProject(project))),
    map(() => true)
  );
};

export const verifyStartedGuard = () => {
  const pStore = inject(ProjectStore);
  const store = inject(Store);

  return store
    .selectOnce(ProjectUploadState.started)
    .pipe(
      switchMap((started) => (started ? of(true) : redirect(pStore, store)))
    );
};

export const startPageGuard = () =>
  inject(Store)
    .dispatch(new SetAsStarted())
    .pipe(map(() => true));
