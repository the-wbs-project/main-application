import { NgClass } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  input,
  signal,
} from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faCactus } from '@fortawesome/pro-thin-svg-icons';
import { faFilters, faPlus } from '@fortawesome/pro-solid-svg-icons';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonModule } from '@progress/kendo-angular-buttons';
import { DialogModule, DialogService } from '@progress/kendo-angular-dialog';
import { DataServiceFactory } from '@wbs/core/data-services';
import { Project, PROJECT_STATI } from '@wbs/core/models';
import { sorter, Storage } from '@wbs/core/services';
import { MetadataStore } from '@wbs/core/store';
import {
  ProjectCreateDialogComponent,
  ProjectGridComponent,
  ProjectListFiltersComponent,
  ProjectTableomponent,
  ProjectViewToggleComponent,
} from './components';
import { ActivatedRoute, Router } from '@angular/router';
import { of, switchMap } from 'rxjs';
import { TreeListExampleComponent } from './test.component';

declare type ProjectView = 'grid' | 'table';

@Component({
  standalone: true,
  templateUrl: './project-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ButtonModule,
    DialogModule,
    FontAwesomeModule,
    NgClass,
    ProjectGridComponent,
    ProjectListFiltersComponent,
    ProjectTableomponent,
    ProjectViewToggleComponent,
    TranslateModule,
    TreeListExampleComponent,
  ],
})
export class ProjectListComponent {
  private readonly data = inject(DataServiceFactory);
  private readonly dialog = inject(DialogService);
  private readonly metadata = inject(MetadataStore);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly storage = inject(Storage);

  readonly cactusIcon = faCactus;
  readonly filterIcon = faFilters;
  readonly plusIcon = faPlus;
  readonly loading = signal(true);
  readonly projects = signal<Project[]>([]);
  readonly userId = input.required<string>();
  readonly orgId = input.required<string>();
  readonly view = signal<ProjectView>(this.getView() ?? 'table');
  readonly assignedToMe = signal(false);
  readonly stati = signal([
    PROJECT_STATI.PLANNING,
    PROJECT_STATI.APPROVAL,
    PROJECT_STATI.EXECUTION,
    PROJECT_STATI.FOLLOW_UP,
  ]);
  readonly search = signal<string | undefined>(undefined);
  readonly categories = signal<string[]>(
    this.metadata.categories.projectCategories.map((c) => c.id)
  );
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

  constructor() {
    effect(
      () => {
        const owner = this.orgId();
        this.loading.set(true);
        this.data.projects.getAllAsync(owner).subscribe((projects) => {
          this.projects.set(
            projects.sort((a, b) =>
              sorter(a.lastModified, b.lastModified, 'desc')
            )
          );
          this.loading.set(false);
        });
      },
      {
        allowSignalWrites: true,
      }
    );
  }

  launchCreateProject(): void {
    ProjectCreateDialogComponent.launchAsync(this.dialog)
      .pipe(
        switchMap((project) =>
          project
            ? this.data.projects.getRecordIdAsync(project.owner, project.id)
            : of(undefined)
        )
      )
      .subscribe((recordId) => {
        if (!recordId) return;

        console.log('recordId', recordId);
        this.router.navigate(['./', 'view', recordId], {
          relativeTo: this.route,
        });
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

    if (search) list = this.filterByName(list, search);

    if (assignedToMe) {
      list = list.filter(
        (project) =>
          project.roles?.some((role) => role.userId === userId) ?? false
      );
    }
    list = this.filterByStati(list, stati);
    list = this.filterByCategories(list, categories);

    return list;
  }

  private getView(): ProjectView | undefined {
    return this.storage.local.get('projectListView') as ProjectView;
  }

  private filterByStati(
    projects: Project[] | null | undefined,
    stati: string[]
  ): Project[] {
    if (!projects || stati.length === 0) return [];

    return projects.filter((x) => stati.includes(x.status));
  }

  private filterByCategories(
    projects: Project[] | null | undefined,
    categories: string[]
  ): Project[] {
    if (!projects || categories.length === 0) return [];

    return projects.filter((x) => categories.includes(x.category));
  }

  private filterByName(
    projects: Project[] | null | undefined,
    text: string
  ): Project[] {
    return (projects ?? []).filter((x) =>
      (x.title ?? '').toLowerCase().includes(text.toLowerCase())
    );
  }
}
