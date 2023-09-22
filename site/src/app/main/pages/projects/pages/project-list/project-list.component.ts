import { NgClass, NgFor, NgIf } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faCactus } from '@fortawesome/pro-thin-svg-icons';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { Store } from '@ngxs/store';
import { plusIcon } from '@progress/kendo-svg-icons';
import { PROJECT_STATI } from '@wbs/core/models';
import { PageHeaderComponent } from '@wbs/main/components/page-header/page-header.component';
import { FillElementDirective } from '@wbs/main/directives/fill-element.directive';
import { CategoryLabelPipe } from '@wbs/main/pipes/category-label.pipe';
import { EditedDateTextPipe } from '@wbs/main/pipes/edited-date-text.pipe';
import { MetadataState } from '@wbs/main/states';
import { ProjectListFiltersComponent } from './components/project-list-filters/project-list-filters.component';
import { ProjectListFilters } from './models';
import { ProjectFilterPipe } from './pipes/project-filter.pipe';
import { ProjectListState } from './states';
import { faFilters } from '@fortawesome/pro-solid-svg-icons';

@Component({
  standalone: true,
  templateUrl: './project-list.component.html',
  styleUrls: ['./project-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CategoryLabelPipe,
    EditedDateTextPipe,
    FillElementDirective,
    FontAwesomeModule,
    NgbDropdownModule,
    NgClass,
    NgFor,
    NgIf,
    PageHeaderComponent,
    ProjectListFiltersComponent,
    ProjectFilterPipe,
    RouterModule,
    TranslateModule,
  ],
})
export class ProjectListComponent {
  @Input() owner?: string;
  @Input() status?: string;
  @Input() type?: string;

  readonly faCactus = faCactus;
  readonly faFilters = faFilters;

  filterToggle = false;

  filters: ProjectListFilters = {
    assignedToMe:
      this.store.selectSnapshot(ProjectListState.anyAssignedTome) ?? false,
    stati: [
      PROJECT_STATI.PLANNING,
      PROJECT_STATI.EXECUTION,
      PROJECT_STATI.FOLLOW_UP,
    ],
    categories: this.store
      .selectSnapshot(MetadataState.projectCategories)
      .map((c) => c.id),
  };
  expanded = true;

  readonly projects = toSignal(this.store.select(ProjectListState.list));
  readonly loading = toSignal(this.store.select(ProjectListState.loading));
  readonly plusIcon = plusIcon;

  constructor(
    private readonly cd: ChangeDetectorRef,
    private readonly store: Store
  ) {}

  force() {
    this.cd.detectChanges();
  }
}
