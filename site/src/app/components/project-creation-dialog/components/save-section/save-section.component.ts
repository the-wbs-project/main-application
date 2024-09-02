import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faSpinner } from '@fortawesome/pro-duotone-svg-icons';
import {
  faCheck,
  faExclamationTriangle,
} from '@fortawesome/pro-solid-svg-icons';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonModule } from '@progress/kendo-angular-buttons';
import { DataServiceFactory } from '@wbs/core/data-services';
import {
  Category,
  LibraryEntryNode,
  PROJECT_NODE_VIEW,
  PROJECT_STATI,
  Project,
  ProjectNode,
} from '@wbs/core/models';
import {
  CategoryService,
  IdService,
  Resources,
  sorter,
} from '@wbs/core/services';
import { CategorySelection, UserViewModel } from '@wbs/core/view-models';
import { UserStore } from '@wbs/core/store';
import { switchMap } from 'rxjs/operators';

@Component({
  standalone: true,
  selector: 'wbs-save-section',
  templateUrl: './save-section.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ButtonModule, FontAwesomeModule, TranslateModule],
  styles: ['.row-header { max-width: 200px; }'],
})
export class SaveSectionComponent {
  private readonly categoryService = inject(CategoryService);
  private readonly data = inject(DataServiceFactory);
  private readonly resources = inject(Resources);
  private readonly userId = inject(UserStore).userId;

  readonly faCheck = faCheck;
  readonly faSpinner = faSpinner;
  readonly faExclamationTriangle = faExclamationTriangle;
  readonly done = output<void>();
  readonly owner = input.required<string>();
  readonly entryId = input.required<string>();
  readonly version = input.required<number>();
  readonly newId = input.required<string>();
  readonly templateTitle = input.required<string>();
  readonly category = input.required<Category>();
  readonly disciplines = input.required<CategorySelection[]>();
  readonly tasks = input.required<LibraryEntryNode[]>();
  readonly approvers = input.required<UserViewModel[]>();
  readonly pms = input.required<UserViewModel[]>();
  readonly smes = input.required<UserViewModel[]>();
  readonly approvalEnabled = input.required<boolean>();
  readonly saveState = signal<'saving' | 'saved' | 'error' | undefined>(
    undefined
  );
  readonly disciplineReview = computed(() => {
    const list = this.disciplines();

    return list.length === 0
      ? this.resources.get('General.None')
      : list
          .filter((x) => x.selected)
          .map((x) => x.label)
          .join(', ');
  });
  readonly approverList = computed(() => this.getUserList(this.approvers()));
  readonly pmList = computed(() => this.getUserList(this.pms()));
  readonly smeList = computed(() => this.getUserList(this.smes()));

  save(): void {
    this.saveState.set('saving');

    const disciplines = this.categoryService.extract(
      this.disciplines(),
      []
    ).categories;

    const now = new Date();
    const owner = this.owner();
    const entryId = this.entryId();
    const version = this.version();

    const project: Project = {
      id: this.newId(),
      owner: this.owner(),
      category: this.category().id,
      recordId: '',
      title: this.templateTitle(),
      disciplines,
      createdOn: now,
      lastModified: now,
      mainNodeView: PROJECT_NODE_VIEW.PHASE,
      roles: [],
      status: PROJECT_STATI.PLANNING,
      description: '',
      createdBy: this.userId()!,
      libraryLink: { owner, entryId, version },
    };
    const tasks: ProjectNode[] = [];
    const parentIdConversion = new Map<string, string>();

    for (let task of this.tasks()) {
      const id = IdService.generate();

      parentIdConversion.set(task.id, id);
      tasks.push({
        id,
        projectId: project.id,
        createdOn: now,
        lastModified: now,
        order: task.order,
        title: task.title,
        description: task.description,
        disciplineIds: task.disciplineIds,
        parentId: task.parentId,
        phaseIdAssociation: task.phaseIdAssociation,
        tags: task.tags,
        absFlag: null,
        libraryTaskLink: { owner, entryId, version, taskId: task.id },
      });
    }
    //
    //  Fix parent ids
    //
    for (const node of tasks) {
      if (node.parentId === undefined) continue;

      node.parentId = parentIdConversion.get(node.parentId);
    }

    this.data.projects
      .putProjectAsync(project)
      .pipe(
        switchMap(() =>
          this.data.projects.putTasksAsync(project.owner, project.id, tasks, [])
        )
      )
      .subscribe(() => {
        this.saveState.set('saved');
      });
  }

  getUserList(users: UserViewModel[]): string | undefined {
    if (users.length === 0) return undefined;

    return users
      .sort((a, b) => sorter(a.fullName, b.fullName))
      .map((x) => x.fullName)
      .join(', ');
  }
}
