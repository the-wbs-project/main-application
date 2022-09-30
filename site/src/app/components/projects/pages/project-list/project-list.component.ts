import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProjectService, Resources, TitleService } from '@wbs/shared/services';
import { map, Observable } from 'rxjs';
import {
  Project,
  PROJECT_VIEW_STATI,
  PROJECT_VIEW_STATI_TYPE,
} from '@wbs/shared/models';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

@UntilDestroy()
@Component({
  templateUrl: './project-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectListComponent implements OnInit {
  private readonly titlePrefix: string;

  readonly status$: Observable<PROJECT_VIEW_STATI_TYPE>;
  readonly projects$: Observable<Project[]>;
  readonly stati: PROJECT_VIEW_STATI_TYPE[] = [
    PROJECT_VIEW_STATI.ACTIVE,
    PROJECT_VIEW_STATI.PLANNING,
    PROJECT_VIEW_STATI.EXECUTION,
    PROJECT_VIEW_STATI.FOLLOW_UP,
    PROJECT_VIEW_STATI.CLOSED,
  ];

  constructor(
    resources: Resources,
    private readonly title: TitleService,
    private readonly route: ActivatedRoute,
    private readonly projectService: ProjectService
  ) {
    this.titlePrefix = resources.get('Pages.Projects');

    title.setTitle(this.titlePrefix, false);

    this.status$ = this.route.params.pipe(map((p) => p['status']));
    this.projects$ = this.route.data.pipe(map((d) => d['projects']));
  }

  ngOnInit(): void {
    this.status$
      .pipe(
        map((status) => this.projectService.getStatus(status)),
        map((status) => `${this.titlePrefix} - ${status}`),
        untilDestroyed(this)
      )
      .subscribe((text) => this.title.setTitle(text, false));
  }
}
