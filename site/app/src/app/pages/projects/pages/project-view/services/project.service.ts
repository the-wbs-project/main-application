import { Injectable, inject } from '@angular/core';
import { ActivatedRouteSnapshot } from '@angular/router';
import { Store } from '@ngxs/store';
import {
  NavigationLink,
  ProjectNode,
  RoutedBreadcrumbItem,
} from '@wbs/core/models';
import { IdService, Utils } from '@wbs/core/services';
import { WbsNodeView } from '@wbs/core/view-models';
import { MetadataStore } from '@wbs/core/store';
import { Observable, forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import { PROJECT_NAVIGATION, TASK_NAVIGATION } from '../models';
import { ProjectState, TasksState } from '../states';

@Injectable()
export class ProjectService {
  private readonly metadata = inject(MetadataStore);
  protected readonly store = inject(Store);

  static getProjectUrl(route: ActivatedRouteSnapshot): string[] {
    return [
      '/',
      Utils.getParam(route, 'org'),
      'projects',
      'view',
      Utils.getParam(route, 'projectId'),
    ];
  }

  static getTaskUrl(route: ActivatedRouteSnapshot): string[] {
    return [
      ...ProjectService.getProjectUrl(route),
      'tasks',
      Utils.getParam(route, 'taskId'),
    ];
  }

  getRoleTitle(
    role: string | undefined | null,
    useAbbreviations = false
  ): string {
    if (!role) return '';

    const definition = this.metadata.roles.definitions.find(
      (x) => x.id === role
    )!;

    return useAbbreviations ? definition.abbreviation : definition.description;
  }

  getPhaseIds(nodes: ProjectNode[] | WbsNodeView[]): string[] {
    return nodes.filter((x) => x.parentId == null).map((x) => x.id);
  }

  createTask(
    projectId: string,
    parentId: string,
    model: Partial<ProjectNode>,
    nodes: ProjectNode[]
  ): ProjectNode {
    const siblings = nodes?.filter((x) => x.parentId === parentId) ?? [];
    const ts = new Date();
    let order = 0;

    for (const x of siblings) {
      if (x.order > order) order = x.order;
    }
    order++;

    return <ProjectNode>{
      ...model,
      id: IdService.generate(),
      parentId,
      projectId,
      order,
      createdOn: ts,
      lastModified: ts,
    };
  }

  getProjectBreadcrumbs(
    route: ActivatedRouteSnapshot
  ): Observable<RoutedBreadcrumbItem[]> {
    const currentUrl = ProjectService.getProjectUrl(route);
    const crumbSections = route.data['crumbs'];
    let link: NavigationLink | undefined;

    return this.store.selectOnce(ProjectState.current).pipe(
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
        return crumbs;
      })
    );
  }

  getTaskBreadcrumbs(
    route: ActivatedRouteSnapshot
  ): Observable<RoutedBreadcrumbItem[]> {
    const projectUrl = ProjectService.getProjectUrl(route);
    const taskUrl = ProjectService.getTaskUrl(route);

    const crumbSections = route.data['crumbs'];
    let link: NavigationLink | undefined;

    return forkJoin({
      project: this.store.selectOnce(ProjectState.current),
      task: this.store.selectOnce(TasksState.current),
    }).pipe(
      map(({ project, task }) => {
        const crumbs: RoutedBreadcrumbItem[] = [
          {
            route: ['/', Utils.getParam(route, 'org'), 'projects'],
            text: 'Pages.Projects',
          },
          {
            route: [...projectUrl],
            text: project!.title,
            isText: true,
          },
          {
            route: [...taskUrl],
            text: task!.title,
            isText: true,
          },
        ];

        for (const section of crumbSections) {
          link = (link?.items ?? (TASK_NAVIGATION as NavigationLink[])).find(
            (x) => x.section == section
          );
          if (!link) continue;

          if (link.route) {
            taskUrl.push(...link.route);

            crumbs.push({
              route: [...taskUrl],
              text: link.text,
            });
          } else {
            crumbs.push({
              text: link.text,
            });
          }
        }
        return crumbs;
      })
    );
  }
}
