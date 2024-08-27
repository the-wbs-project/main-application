import { Injectable, effect, inject, signal } from '@angular/core';
import { ActivatedRouteSnapshot } from '@angular/router';
import { Store } from '@ngxs/store';
import { Utils } from '@wbs/core/services';
import { NavigationLink, RoutedBreadcrumbItem } from '@wbs/core/models';
import { UiStore } from '@wbs/core/store';
import { ProjectViewModel, TaskViewModel } from '@wbs/core/view-models';
import { PROJECT_NAVIGATION, TASK_NAVIGATION } from '../models';
import { TasksState } from '../states';
import { ProjectStore } from '../stores';
import { ProjectService } from './project.service';

@Injectable()
export class ProjectBreadcrumbsService {
  private readonly projectStore = inject(ProjectStore);
  private readonly store = inject(Store);
  private readonly ui = inject(UiStore);
  private readonly _route = signal<ActivatedRouteSnapshot | undefined>(
    undefined
  );

  constructor() {
    //
    //  Project crumbs
    //
    effect(() => {
      const route = this._route();
      const project = this.projectStore.project();

      if (!project || !route) return;

      this.project(project, route);
    });
  }

  setTaskCrumbs(route: ActivatedRouteSnapshot): void {
    this.task(this.getProject(), this.getTask(), route);

    this.store.select(TasksState.current).subscribe((task) => {
      if (!task) return;

      this.task(this.getProject(), task, route);
    });
  }

  private getProject(): ProjectViewModel {
    return this.projectStore.project()!;
  }

  private getTask(): TaskViewModel {
    return this.store.selectSnapshot(TasksState.current)!;
  }

  private project(
    project: ProjectViewModel,
    route: ActivatedRouteSnapshot
  ): void {
    const currentUrl = ProjectService.getProjectUrl(route);
    const crumbSections = route.data['crumbs'];
    let link: NavigationLink | undefined;

    const crumbs: RoutedBreadcrumbItem[] = [
      {
        route: ['/', Utils.getParam(route, 'org'), 'projects'],
        text: 'General.Projects',
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
    this.set(crumbs);
  }

  private task(
    project: ProjectViewModel,
    task: TaskViewModel,
    route: ActivatedRouteSnapshot
  ): void {
    const projectUrl = ProjectService.getProjectUrl(route);
    const taskUrl = ProjectService.getTaskUrl(route);

    const crumbSections = route.data['crumbs'];
    let link: NavigationLink | undefined;

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
    this.set(crumbs);
  }

  private set(crumbs: RoutedBreadcrumbItem[]): void {
    crumbs.at(-1)!.route = undefined;

    this.ui.setBreadcrumbs(crumbs);
  }
}
