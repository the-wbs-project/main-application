import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { faPlus } from '@fortawesome/pro-solid-svg-icons';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Store } from '@ngxs/store';
import { PROJECT_VIEW_STATI, PROJECT_VIEW_STATI_TYPE } from '@wbs/core/models';
import { ProjectService, Resources, TitleService } from '@wbs/core/services';
import { ProjectListState } from '@wbs/core/states';
import { map } from 'rxjs';

@UntilDestroy()
@Component({
  templateUrl: './project-list.component.html',
  styleUrls: ['./project-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectListComponent implements OnInit {
  private readonly titlePrefix: string;

  readonly faPlus = faPlus;
  readonly status$ = this.route.params.pipe(
    map((p) => <PROJECT_VIEW_STATI_TYPE>p['status'])
  );
  readonly projects$ = this.store.select(ProjectListState.list);
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
    private readonly projectService: ProjectService,
    private readonly store: Store,
    private readonly route: ActivatedRoute
  ) {
    this.titlePrefix = resources.get('Pages.Projects');

    title.setTitle(this.titlePrefix, false);
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
