import { inject } from '@angular/core';
import { ActivatedRouteSnapshot } from '@angular/router';
import { Navigate } from '@ngxs/router-plugin';
import { Store } from '@ngxs/store';
import { DataServiceFactory } from '@wbs/core/data-services';
import { Utils } from '@wbs/main/services';
import { forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import { EntryState } from './entry-state.service';
import { LIBRARY_CLAIMS, RoutedBreadcrumbItem } from '@wbs/core/models';
import { ENTRY_NAVIGATION } from '../models';
import { NavigationLink } from '@wbs/main/models';
import { EntryService } from './entry.service';
import { SetBreadcrumbs } from '@wbs/main/actions';

export const redirectGuard = (route: ActivatedRouteSnapshot) => {
  const store = inject(Store);

  return store
    .dispatch(
      new Navigate([
        '/',
        Utils.getParam(route, 'org'),
        'library',
        'view',
        Utils.getParam(route, 'ownerId'),
        Utils.getParam(route, 'entryId'),
        Utils.getParam(route, 'versionId'),
        'about',
      ])
    )
    .pipe(map(() => true));
};

export const redirectTaskGuard = (route: ActivatedRouteSnapshot) =>
  inject(Store)
    .dispatch(
      new Navigate([
        Utils.getParam(route, 'org'),
        'library',
        'view',
        Utils.getParam(route, 'ownerId'),
        Utils.getParam(route, 'entryId'),
        Utils.getParam(route, 'versionId'),
        'tasks',
        route.params['taskId'],
        'about',
      ])
    )
    .pipe(map(() => true));

export const populateGuard = (route: ActivatedRouteSnapshot) => {
  const data = inject(DataServiceFactory);
  const state = inject(EntryState);
  const owner = Utils.getParam(route, 'ownerId');
  const entryId = Utils.getParam(route, 'entryId');
  const versionId = parseInt(Utils.getParam(route, 'versionId'), 10);

  if (!owner || !entryId || !versionId || isNaN(versionId)) return false;

  return forkJoin({
    entry: data.libraryEntries.getAsync(owner, entryId),
    version: data.libraryEntryVersions.getAsync(owner, entryId, versionId),
    tasks: data.libraryEntryNodes.getAllAsync(owner, entryId, versionId),
  }).pipe(
    map(({ entry, version, tasks }) => {
      state.setAll(entry, version, tasks);

      return true;
    })
  );
};

export const entryNavGuard = (route: ActivatedRouteSnapshot) => {
  const state = inject(EntryState);
  const section = route.data['section'];
  const crumbSections = route.data['crumbs'];

  if (section) state.setNavSectionEntry(section);
  if (!crumbSections) return;

  let link: NavigationLink | undefined;
  let currentUrl = [...EntryService.getEntryUrl(route)];
  const crumbs: RoutedBreadcrumbItem[] = [
    {
      route: ['/', Utils.getParam(route, 'org'), 'library'],
      text: 'General.Library',
    },
    {
      route: [...currentUrl],
      text: state.version()!.title,
      isText: true,
    },
  ];

  for (const section of crumbSections) {
    link = (link?.items ?? (ENTRY_NAVIGATION as NavigationLink[])).find(
      (x) => x.section == section
    );

    if (!link) continue;

    if (link.route) {
      currentUrl.push(...link.route);

      crumbs.push({
        route: [...currentUrl],
        text: link.text,
      });
    } else {
      crumbs.push({
        text: link.text,
      });
    }
  }
  crumbs.at(-1)!.route = undefined;

  return inject(Store).dispatch(new SetBreadcrumbs(crumbs));
};

export const taskNavGuard = (route: ActivatedRouteSnapshot) =>
  inject(EntryState).setNavSectionTask(route.data['section']);

export const verifyTaskUpdateClaimGuard = (route: ActivatedRouteSnapshot) => {
  const data = inject(DataServiceFactory);
  const owner = Utils.getParam(route, 'ownerId');
  const entryId = Utils.getParam(route, 'entryId');

  if (!owner || !entryId) return false;

  return data.claims
    .getLibraryEntryClaimsAsync(owner, entryId)
    .pipe(map((claims) => claims.includes(LIBRARY_CLAIMS.TASKS.UPDATE)));
};
