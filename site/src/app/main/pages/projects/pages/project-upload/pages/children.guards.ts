import { inject } from '@angular/core';
import { ActivatedRouteSnapshot } from '@angular/router';
import { Navigate } from '@ngxs/router-plugin';
import { Store } from '@ngxs/store';
import { MembershipState } from '@wbs/main/states';
import { map, switchMap, tap } from 'rxjs/operators';
import { ProjectUploadState } from '../states';
import { forkJoin, of } from 'rxjs';
import { SetAsStarted } from '../actions';
import { Resources } from '@wbs/core/services';
import { SetHeaderInformation } from '../../project-create/actions';
import { SetBreadcrumbs } from '@wbs/main/actions';

function redirect(store: Store, route: ActivatedRouteSnapshot) {
  return forkJoin({
    project: store.selectOnce(ProjectUploadState.current),
    owner: route.params['owner']
      ? of(route.params['owner'])
      : store.selectOnce(MembershipState.organization),
  }).pipe(
    tap(({ project, owner }) => {
      const ownerId = typeof owner === 'string' ? owner : owner?.name;

      return store.dispatch(
        new Navigate([
          '/' + ownerId,
          'projects',
          'upload',
          project!.id,
          'start',
        ])
      );
    }),
    map(() => true)
  );
}

export const verifyStartedGuard = (route: ActivatedRouteSnapshot) => {
  const store = inject(Store);

  return store
    .selectOnce(ProjectUploadState.started)
    .pipe(
      switchMap((started) => (started ? of(true) : redirect(store, route)))
    );
};

export const startGuard = () => {
  const store = inject(Store);

  return store.dispatch(new SetAsStarted()).pipe(map(() => true));
};

export const setupGuard = (route: ActivatedRouteSnapshot) => {
  const store = inject(Store);
  const resources = inject(Resources);

  return forkJoin({
    project: store.selectOnce(ProjectUploadState.current),
    owner: route.params['owner']
      ? of(route.params['owner'])
      : store.selectOnce(MembershipState.organization),
  }).pipe(
    tap(({ project, owner }) => {
      const ownerId = typeof owner === 'string' ? owner : owner?.name;

      return (
        store.dispatch([
          new SetHeaderInformation(
            route.data['title'],
            route.data['description']
          ),
          new SetBreadcrumbs(
            [
              {
                route: ['/', ownerId, 'projects'],
                label: 'General.Projects',
              },
              {
                route: ['/', ownerId, 'projects', 'view', project!.id],
                label: project!.title,
                isText: true,
              },
              {
                route: ['/', ownerId, 'projects', 'upload', project!.id],
                label: 'General.Upload',
              },
            ],
            resources.get(route.data['title'] ?? '')
          ),
        ]),
        map(() => true)
      );
    })
  );
};
