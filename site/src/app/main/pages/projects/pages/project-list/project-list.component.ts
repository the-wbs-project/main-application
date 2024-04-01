import { NgClass } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  computed,
  inject,
  input,
  signal,
} from '@angular/core';
import { RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faCactus } from '@fortawesome/pro-thin-svg-icons';
import { faFilters } from '@fortawesome/pro-solid-svg-icons';
import { TranslateModule } from '@ngx-translate/core';
import { DataServiceFactory } from '@wbs/core/data-services';
import { ListItem, PROJECT_STATI, Project } from '@wbs/core/models';
import { sorter } from '@wbs/core/services';
import { PageHeaderComponent } from '@wbs/main/components/page-header';
import { EditedDateTextPipe } from '@wbs/main/pipes/edited-date-text.pipe';
import { ProjectCategoryLabelPipe } from '@wbs/main/pipes/project-category-label.pipe';
import { ProjectListFiltersComponent } from './components/project-list-filters';
import { ProjectListService } from './services';

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
    RouterModule,
    TranslateModule,
  ],
})
export class ProjectListComponent implements OnInit {
  private readonly data = inject(DataServiceFactory);
  private readonly service = inject(ProjectListService);

  readonly faCactus = faCactus;
  readonly faFilters = faFilters;
  readonly loading = signal(true);
  readonly projects = signal<Project[]>([]);
  readonly owner = input.required<string>();
  readonly userId = input.required<string>();
  readonly projectCategories = input.required<ListItem[]>();
  readonly assignedToMe = signal(false);
  readonly stati = signal([
    PROJECT_STATI.PLANNING,
    PROJECT_STATI.APPROVAL,
    PROJECT_STATI.EXECUTION,
    PROJECT_STATI.FOLLOW_UP,
  ]);
  readonly search = signal<string | undefined>(undefined);
  readonly categories = signal<string[]>([]);
  readonly filteredList = computed(() =>
    this.filter(
      this.projects(),
      this.userId(),
      this.search(),
      this.assignedToMe(),
      this.stati(),
      this.categories()
    )
  );
  expanded = true;
  filterToggle = signal(false);

  ngOnInit(): void {
    this.categories.set(this.projectCategories().map((c) => c.id));

    this.data.projects.getAllAsync(this.owner()).subscribe((projects) => {
      this.projects.set(
        projects.sort((a, b) => sorter(a.lastModified, b.lastModified, 'desc'))
      );
      this.loading.set(false);
    });
  }

  private filter(
    list: Project[],
    userId: string,
    search: string | undefined,
    assignedToMe: boolean,
    stati: PROJECT_STATI[],
    categories: string[]
  ): Project[] {
    if (list == null || list.length === 0) return list;

    if (search) list = this.service.filterByName(list, search);

    if (assignedToMe) {
      list = list.filter(
        (project) =>
          project.roles?.some((role) => role.userId === userId) ?? false
      );
    }
    list = this.service.filterByStati(list, stati);
    list = this.service.filterByCategories(list, categories);

    return list;
  }
}
