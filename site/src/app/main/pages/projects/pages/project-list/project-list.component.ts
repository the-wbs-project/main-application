import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { faPlus } from '@fortawesome/pro-solid-svg-icons';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Store } from '@ngxs/store';
import { PROJECT_VIEW_STATI, PROJECT_VIEW_STATI_TYPE } from '@wbs/core/models';
import { ProjectService, Resources, TitleService } from '@wbs/core/services';
import { OrganizationState } from '@wbs/core/states';
import { ProjectStatusPipe } from '@wbs/main/pipes/project-status.pipe';
import { map } from 'rxjs';
import { ProjectSortPipe } from './pipes/project-sort.pipe';
import { ProjectStatusFilterPipe } from './pipes/project-status-filter.pipe';
import { FillElementDirective } from '@wbs/main/directives/fill-element.directive';
import { TranslateModule } from '@ngx-translate/core';
import { LoaderModule } from '@progress/kendo-angular-indicators';
import { EditedDateTextPipe } from '@wbs/main/pipes/edited-date-text.pipe';
import { CategoryLabelPipe } from '@wbs/main/pipes/category-label.pipe';

@UntilDestroy()
@Component({
  standalone: true,
  templateUrl: './project-list.component.html',
  styleUrls: ['./project-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CategoryLabelPipe, CommonModule, EditedDateTextPipe, FillElementDirective, LoaderModule, ProjectSortPipe, ProjectStatusFilterPipe, ProjectStatusPipe, RouterModule, TranslateModule]
})
export class ProjectListComponent implements OnInit {
  private readonly titlePrefix: string;

  readonly faPlus = faPlus;
  readonly status$ = this.route.params.pipe(
    map((p) => <PROJECT_VIEW_STATI_TYPE>p['status'])
  );
  readonly loading$ = this.store.select(OrganizationState.loading);
  readonly projects$ = this.store.select(OrganizationState.projects);
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
