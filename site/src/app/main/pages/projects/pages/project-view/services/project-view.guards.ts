import { inject } from '@angular/core';
import { ActivatedRouteSnapshot } from '@angular/router';
import { Navigate } from '@ngxs/router-plugin';
import { Store } from '@ngxs/store';
import { LoadDiscussionForum, SetBreadcrumbs } from '@wbs/main/actions';
import { Utils } from '@wbs/main/services';
import { of } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';
import {
  InitiateChecklist,
  SetApproval,
  SetApprovalView,
  SetNavSection,
  VerifyProject,
  VerifyTask,
  VerifyTasks,
} from '../actions';
import { PROJECT_NAVIGATION } from '../models';
import { ProjectState } from '../states';
import { NavigationLink } from '@wbs/main/models';
import { RoutedBreadcrumbItem } from '@wbs/core/models';
import { ProjectService } from './project.service';
import { TitleService } from '@wbs/core/services';

export const closeApprovalWindowGuard = () =>
  inject(Store).dispatch(new SetApproval());

export const projectDiscussionGuard = (route: ActivatedRouteSnapshot) => {
  const store = inject(Store);
  const owner = Utils.getParam(route, 'org');

  return store.dispatch(
    new LoadDiscussionForum(owner, route.params['projectId'])
  );
};

export const projectRedirectGuard = (route: ActivatedRouteSnapshot) => {
  console.log(ProjectService.getProjectUrl(route));
  return inject(Store).dispatch(
    new Navigate([...ProjectService.getProjectUrl(route), 'about'])
  );
};

export const projectVerifyGuard = (route: ActivatedRouteSnapshot) => {
  const store = inject(Store);
  const org = Utils.getParam(route, 'org');

  inject(TitleService).setTitle('Pages.Projects', true);

  return store
    .dispatch([
      new InitiateChecklist(),
      new VerifyProject(org, route.params['projectId']),
    ])
    .pipe(
      switchMap(() => store.selectOnce(ProjectState.current)),
      switchMap((project) => {
        if (!project) return of(false);

        return store.dispatch(new VerifyTasks(project, true));
      })
    );
};

export const projectNavGuard = (route: ActivatedRouteSnapshot) => {
  const store = inject(Store);
  const section = route.data['navSection'];
  const crumbSections = route.data['crumbs'];

  store.dispatch(new SetNavSection(section));

  if (!crumbSections) return;

  let link: NavigationLink | undefined;
  let currentUrl = [...ProjectService.getProjectUrl(route)];

  return store.selectOnce(ProjectState.current).pipe(
    map((project) => {
      const crumbs: RoutedBreadcrumbItem[] = [
        {
          route: ['/', Utils.getParam(route, 'org'), 'projects'],
          text: 'Pages.Projects',
        },
        {
          route: [...currentUrl],
          text: project!.title,
          isText: true,
        },
      ];

      for (const section of crumbSections) {
        link = (link?.items ?? (PROJECT_NAVIGATION as NavigationLink[])).find(
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

      return crumbs;
    }),
    switchMap((crumbs) => store.dispatch(new SetBreadcrumbs(crumbs)))
  );
};

export const taskVerifyGuard = (route: ActivatedRouteSnapshot) => {
  const store = inject(Store);
  const taskId = route.params['taskId'];

  if (!taskId) return false;

  return store.dispatch([new VerifyTask(taskId)]);
};

export const setApprovalViewAsTask = () =>
  inject(Store).dispatch(new SetApprovalView('task'));

export const setApprovalViewAsProject = () =>
  inject(Store).dispatch(new SetApprovalView('project'));
