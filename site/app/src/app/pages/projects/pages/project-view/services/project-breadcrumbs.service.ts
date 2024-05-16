import { Injectable, inject } from '@angular/core';
import { ActivatedRouteSnapshot } from '@angular/router';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Store } from '@ngxs/store';
import { Utils } from '@wbs/core/services';
import {
  NavigationLink,
  Project,
  RoutedBreadcrumbItem,
} from '@wbs/core/models';
import { UiStore } from '@wbs/core/store';
import { WbsNodeView } from '@wbs/core/view-models';
import { Subscription } from 'rxjs';
import { PROJECT_NAVIGATION, TASK_NAVIGATION } from '../models';
import { ProjectState, TasksState } from '../states';
import { ProjectService } from './project.service';

@Injectable()
@UntilDestroy()
export class ProjectBreadcrumbsService {
  private readonly store = inject(Store);
  private readonly ui = inject(UiStore);
  private sub?: Subscription;

  setProjectCrumbs(route: ActivatedRouteSnapshot): void {
    if (this.sub) this.sub.unsubscribe();

    this.project(this.getProject(), route);

    this.sub = this.store
      .select(ProjectState.current)
      .pipe(untilDestroyed(this))
      .subscribe((project) => {
        if (!project) return;

        this.project(project, route);
      });
  }

  setTaskCrumbs(route: ActivatedRouteSnapshot): void {
    if (this.sub) this.sub.unsubscribe();

    this.task(this.getProject(), this.getTask(), route);

    this.sub = this.store
      .select(TasksState.current)
      .pipe(untilDestroyed(this))
      .subscribe((task) => {
        if (!task) return;

        this.task(this.getProject(), task, route);
      });
  }

  private getProject(): Project {
    return this.store.selectSnapshot(ProjectState.current)!;
  }

  private getTask(): WbsNodeView {
    return this.store.selectSnapshot(TasksState.current)!;
  }

  private project(project: Project, route: ActivatedRouteSnapshot): void {
    const currentUrl = ProjectService.getProjectUrl(route);
    const crumbSections = route.data['crumbs'];
    let link: NavigationLink | undefined;

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
    this.set(crumbs);
  }

  private task(
    project: Project,
    task: WbsNodeView,
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
