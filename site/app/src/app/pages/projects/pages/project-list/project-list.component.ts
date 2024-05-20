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
import { faFilters, faPlus } from '@fortawesome/pro-solid-svg-icons';
import { TranslateModule } from '@ngx-translate/core';
import { DataServiceFactory } from '@wbs/core/data-services';
import { PROJECT_STATI, Project } from '@wbs/core/models';
import { sorter, Storage } from '@wbs/core/services';
import { PageHeaderComponent } from '@wbs/components/page-header';
import { DateTextPipe } from '@wbs/pipes/date-text.pipe';
import { EditedDateTextPipe } from '@wbs/pipes/edited-date-text.pipe';
import { ProjectCategoryLabelPipe } from '@wbs/pipes/project-category-label.pipe';
import { ProjectStatusPipe } from '@wbs/pipes/project-status.pipe';
import { MetadataStore } from '@wbs/core/store';
import { ProjectListFiltersComponent } from './components/project-list-filters';
import { ProjectViewToggleComponent } from './components/project-view-toggle';
import { ProjectListService } from './services';

declare type ProjectView = 'grid' | 'table';

@Component({
  standalone: true,
  templateUrl: './project-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    DateTextPipe,
    EditedDateTextPipe,
    FontAwesomeModule,
    NgClass,
    PageHeaderComponent,
    ProjectCategoryLabelPipe,
    ProjectListFiltersComponent,
    ProjectStatusPipe,
    ProjectViewToggleComponent,
    RouterModule,
    TranslateModule,
  ],
})
export class ProjectListComponent implements OnInit {
  private readonly data = inject(DataServiceFactory);
  private readonly metadata = inject(MetadataStore);
  private readonly service = inject(ProjectListService);
  private readonly storage = inject(Storage);

  readonly cactusIcon = faCactus;
  readonly filterIcon = faFilters;
  readonly plusIcon = faPlus;
  readonly loading = signal(true);
  readonly projects = signal<Project[]>([]);
  readonly owner = input.required<string>();
  readonly userId = input.required<string>();
  readonly view = signal<ProjectView>(this.getView() ?? 'grid');
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
    this.categories.set(
      this.metadata.categories.projectCategories.map((c) => c.id)
    );

    this.data.projects.getAllAsync(this.owner()).subscribe((projects) => {
      this.projects.set(
        projects.sort((a, b) => sorter(a.lastModified, b.lastModified, 'desc'))
      );
      this.loading.set(false);
    });
  }

  setView(view: ProjectView): void {
    this.view.set(view);
    this.storage.local.set('projectListView', view);
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

  private getView(): ProjectView | undefined {
    return this.storage.local.get('projectListView') as ProjectView;
  }
}
