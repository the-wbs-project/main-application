import { inject } from '@angular/core';
import { ActivatedRouteSnapshot } from '@angular/router';
import { Navigate } from '@ngxs/router-plugin';
import { Store } from '@ngxs/store';
import { DataServiceFactory } from '@wbs/core/data-services';
import {
  LIBRARY_CLAIMS,
  NavigationLink,
  RoutedBreadcrumbItem,
} from '@wbs/core/models';
import { Utils } from '@wbs/core/services';
import { EntryService } from '@wbs/core/services/library';
import { EntryStore, UiStore } from '@wbs/core/store';
import { forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import { ENTRY_NAVIGATION } from '../models';

export const redirectGuard = (route: ActivatedRouteSnapshot) => {
  const store = inject(Store);

  return store.dispatch(
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
  );
};

export const redirectTaskGuard = (route: ActivatedRouteSnapshot) =>
  inject(Store).dispatch(
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
  );

export const populateGuard = (route: ActivatedRouteSnapshot) => {
  const data = inject(DataServiceFactory);
  const store = inject(EntryStore);
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
      store.setAll(entry, version, tasks);
    })
  );
};

export const entryNavGuard = (route: ActivatedRouteSnapshot) => {
  const store = inject(EntryStore);
  const section = route.data['section'];
  const crumbSections = route.data['crumbs'];

  if (section) store.setNavSectionEntry(section);
  if (!crumbSections) return;

  let link: NavigationLink | undefined;
  let currentUrl = [...EntryService.getEntryUrl(route)];

  const version = store.version()!;
  const crumbs: RoutedBreadcrumbItem[] = [
    {
      route: ['/', Utils.getParam(route, 'org'), 'library'],
      text: 'General.Library',
    },
    {
      route: [...currentUrl],
      text: version.title,
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

  inject(UiStore).setBreadcrumbs(crumbs);
};

export const taskNavGuard = (route: ActivatedRouteSnapshot) =>
  inject(EntryStore).setNavSectionTask(route.data['section']);

export const verifyTaskUpdateClaimGuard = (route: ActivatedRouteSnapshot) => {
  const data = inject(DataServiceFactory);
  const owner = Utils.getParam(route, 'ownerId');
  const entryId = Utils.getParam(route, 'entryId');

  if (!owner || !entryId) return false;

  return data.claims
    .getLibraryEntryClaimsAsync(owner, entryId)
    .pipe(map((claims) => claims.includes(LIBRARY_CLAIMS.TASKS.UPDATE)));
};
