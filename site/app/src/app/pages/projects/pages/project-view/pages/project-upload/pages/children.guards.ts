import { inject } from '@angular/core';
import { ActivatedRouteSnapshot } from '@angular/router';
import { Navigate } from '@ngxs/router-plugin';
import { Store } from '@ngxs/store';
import { UiStore } from '@wbs/core/store';
import { of } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';
import { SetHeaderInformation } from '../../../../project-create/actions';
import { SetAsStarted } from '../actions';
import { ProjectUploadState } from '../states';

function redirect(store: Store) {
  return store.selectOnce(ProjectUploadState.current).pipe(
    map((p) => p!),
    tap((p) =>
      store.dispatch(
        new Navigate(['/' + p.owner, 'projects', 'upload', p.id, 'start'])
      )
    ),
    map(() => true)
  );
}

export const verifyStartedGuard = () => {
  const store = inject(Store);

  return store
    .selectOnce(ProjectUploadState.started)
    .pipe(switchMap((started) => (started ? of(true) : redirect(store))));
};

export const startGuard = () => {
  const store = inject(Store);

  return store.dispatch(new SetAsStarted()).pipe(map(() => true));
};

export const setupGuard = (route: ActivatedRouteSnapshot) => {
  const store = inject(Store);

  return store.selectOnce(ProjectUploadState.current).pipe(
    map((p) => p!),
    tap((project) => {
      inject(UiStore).setBreadcrumbs([
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
      return store.dispatch([
        new SetHeaderInformation(
          route.data['title'],
          route.data['description']
        ),
      ]);
    })
  );
};
