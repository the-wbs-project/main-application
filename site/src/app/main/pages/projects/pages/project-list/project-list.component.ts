import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faCactus } from '@fortawesome/pro-thin-svg-icons';
import { faFilters } from '@fortawesome/pro-solid-svg-icons';
import { TranslateModule } from '@ngx-translate/core';
import { plusIcon } from '@progress/kendo-svg-icons';
import { PROJECT_STATI } from '@wbs/core/models';
import { SignalStore } from '@wbs/core/services';
import { PageHeaderComponent } from '@wbs/main/components/page-header/page-header.component';
import { EditedDateTextPipe } from '@wbs/main/pipes/edited-date-text.pipe';
import { ProjectCategoryLabelPipe } from '@wbs/main/pipes/project-category-label.pipe';
import { MetadataState } from '@wbs/main/states';
import { ProjectListFiltersComponent } from './components/project-list-filters/project-list-filters.component';
import { ProjectListFilters } from './models';
import { ProjectFilterPipe } from './pipes/project-filter.pipe';
import { ProjectListState } from './states';

@Component({
  standalone: true,
  templateUrl: './project-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    EditedDateTextPipe,
    FontAwesomeModule,
    NgClass,
    PageHeaderComponent,
    ProjectCategoryLabelPipe,
    ProjectListFiltersComponent,
    ProjectFilterPipe,
    RouterModule,
    TranslateModule,
  ],
})
export class ProjectListComponent {
  readonly faCactus = faCactus;
  readonly faFilters = faFilters;

  filterToggle = false;
  filters: ProjectListFilters = {
    assignedToMe:
      this.store.selectSnapshot(ProjectListState.anyAssignedTome) ?? false,
    stati: [
      PROJECT_STATI.PLANNING,
      PROJECT_STATI.APPROVAL,
      PROJECT_STATI.EXECUTION,
      PROJECT_STATI.FOLLOW_UP,
    ],
    categories: this.store
      .selectSnapshot(MetadataState.projectCategories)
      .map((c) => c.id),
  };
  expanded = true;

  readonly projects = this.store.select(ProjectListState.list);
  readonly loading = this.store.select(ProjectListState.loading);
  readonly plusIcon = plusIcon;

  constructor(private readonly store: SignalStore) {}
}
