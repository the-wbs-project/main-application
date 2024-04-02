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
import { Store } from '@ngxs/store';
import { DataServiceFactory } from '@wbs/core/data-services';
import {
  LibraryEntryNode,
  ListItem,
  Member,
  PROJECT_NODE_VIEW,
  PROJECT_STATI,
  Project,
  ProjectCategory,
  ProjectNode,
} from '@wbs/core/models';
import { IdService, Resources } from '@wbs/core/services';
import { CategorySelection } from '@wbs/core/view-models';
import { PhaseLabelPipe } from '@wbs/main/pipes/phase-label.pipe';
import { UserService } from '@wbs/main/services';
import { AuthState } from '@wbs/main/states';
import { switchMap } from 'rxjs/operators';

@Component({
  standalone: true,
  selector: 'wbs-save-section',
  templateUrl: './save-section.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FontAwesomeModule, PhaseLabelPipe, TranslateModule],
  providers: [UserService],
  styles: ['.row-header { max-width: 200px; }'],
})
export class SaveSectionComponent {
  private readonly data = inject(DataServiceFactory);
  private readonly resources = inject(Resources);
  private readonly store = inject(Store);
  private readonly userService = inject(UserService);

  readonly faCheck = faCheck;
  readonly faSpinner = faSpinner;
  readonly faExclamationTriangle = faExclamationTriangle;
  readonly done = output<void>();
  readonly owner = input.required<string>();
  readonly newId = input.required<string>();
  readonly templateTitle = input.required<string>();
  readonly category = input.required<ListItem>();
  readonly disciplines = input.required<CategorySelection[]>();
  readonly tasks = input.required<LibraryEntryNode[]>();
  readonly approverIds = input.required<string[]>();
  readonly pmIds = input.required<string[]>();
  readonly smeIds = input.required<string[]>();
  readonly members = input.required<Member[]>();
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
  readonly approvers = computed(() =>
    this.getUserList(this.members(), this.approverIds())
  );
  readonly pms = computed(() => this.getUserList(this.members(), this.pmIds()));
  readonly smes = computed(() =>
    this.getUserList(this.members(), this.smeIds())
  );

  save(): void {
    this.saveState.set('saving');

    const disciplines: ProjectCategory[] = [];

    for (const discipline of this.disciplines()) {
      if (!discipline.selected) continue;

      disciplines.push(
        discipline.isCustom
          ? {
              id: discipline.id,
              label: discipline.label,
            }
          : discipline.id
      );
    }

    const now = new Date();
    const project: Project = {
      id: this.newId(),
      owner: this.owner(),
      category: this.category().id,
      title: this.templateTitle(),
      disciplines,
      createdOn: now,
      lastModified: now,
      mainNodeView: PROJECT_NODE_VIEW.PHASE,
      roles: [],
      status: PROJECT_STATI.PLANNING,
      description: '',
      createdBy: this.store.selectSnapshot(AuthState.userId)!,
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
      .putAsync(project)
      .pipe(
        switchMap(() =>
          this.data.projectNodes.putAsync(project.owner, project.id, tasks, [])
        )
      )
      .subscribe(() => {
        this.saveState.set('saved');
      });
  }

  getUserList(members: Member[], userIds: string[]): string | undefined {
    if (userIds.length === 0) return undefined;

    return this.userService
      .getSortedUsers(members, userIds)
      .map((x) => x.name)
      .join(', ');
  }
}
