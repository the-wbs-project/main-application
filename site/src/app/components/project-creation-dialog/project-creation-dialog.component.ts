import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  model,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faSpinner } from '@fortawesome/pro-duotone-svg-icons';
import {
  faFloppyDisk,
  faInfo,
  faPeople,
  faWrench,
} from '@fortawesome/pro-solid-svg-icons';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonModule } from '@progress/kendo-angular-buttons';
import {
  DialogCloseResult,
  DialogContentBase,
  DialogModule,
  DialogRef,
  DialogService,
} from '@progress/kendo-angular-dialog';
import { TextBoxModule } from '@progress/kendo-angular-inputs';
import { StepperModule } from '@progress/kendo-angular-layout';
import { VisibilitySelectionComponent } from '@wbs/components/_utils/visiblity-selection';
import { DisciplineEditorComponent } from '@wbs/components/discipline-editor';
import { ProjectCategoryDropdownComponent } from '@wbs/components/project-category-dropdown';
import { DataServiceFactory } from '@wbs/core/data-services';
import { ScrollToTopDirective } from '@wbs/core/directives/scrollToTop.directive';
import { LibraryEntryNode, Member } from '@wbs/core/models';
import { CategoryService, IdService } from '@wbs/core/services';
import { MembershipStore, MetadataStore, UserStore } from '@wbs/core/store';
import {
  CategorySelection,
  LibraryVersionViewModel,
} from '@wbs/core/view-models';
import { FindByIdPipe } from '@wbs/pipes/find-by-id.pipe';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { RolesSectionComponent } from './components/roles-section';
import { SaveSectionComponent } from './components/save-section';

@Component({
  standalone: true,
  templateUrl: './project-creation-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ButtonModule,
    DialogModule,
    DisciplineEditorComponent,
    FindByIdPipe,
    FontAwesomeModule,
    FormsModule,
    ProjectCategoryDropdownComponent,
    RolesSectionComponent,
    SaveSectionComponent,
    ScrollToTopDirective,
    StepperModule,
    TextBoxModule,
    TranslateModule,
    VisibilitySelectionComponent,
  ],
})
export class ProjectCreationComponent extends DialogContentBase {
  private readonly metadata = inject(MetadataStore);
  private readonly catService = inject(CategoryService);
  private readonly data = inject(DataServiceFactory);
  private readonly userId = inject(UserStore).userId;

  readonly faSpinner = faSpinner;
  readonly loading = signal(true);
  readonly view = model<number>(0);
  readonly newId = IdService.generate();
  readonly owner = signal<string | undefined>(undefined);
  readonly version = signal<LibraryVersionViewModel | undefined>(undefined);
  readonly members = signal<Member[]>([]);
  readonly approverIds = signal<string[]>([]);
  readonly pmIds = signal<string[]>([]);
  readonly smeIds = signal<string[]>([]);
  readonly categories = this.metadata.categories.projectCategories;
  readonly tasks = signal<LibraryEntryNode[]>([]);
  readonly projectTitle = model<string>('');
  readonly category = model<string | undefined>(undefined);
  readonly approvalEnabled = inject(MembershipStore).projectApprovalRequired;
  readonly disciplines = model<CategorySelection[]>([]);
  readonly saveState = signal<'saving' | 'saved' | 'error' | undefined>(
    undefined
  );
  steps = [
    { label: 'LibraryCreate.Step_Title', icon: faInfo },
    { label: 'General.Disciplines', icon: faWrench },
    { label: 'General.Roles', icon: faPeople },
    { label: 'LibraryCreate.Step_Review', icon: faFloppyDisk },
  ];

  readonly disciplineReview = computed(() =>
    this.disciplines()
      .filter((x) => x.selected)
      .map((x) => x.label)
      .join(', ')
  );

  constructor(dialog: DialogRef) {
    super(dialog);
  }

  static launchAsync(
    dialog: DialogService,
    org: string,
    version: LibraryVersionViewModel,
    tasks: LibraryEntryNode[]
  ): Observable<any | undefined> {
    const ref = dialog.open({
      content: ProjectCreationComponent,
    });
    const component = ref.content.instance as ProjectCreationComponent;

    component.setup(org, version, tasks);

    return ref.result.pipe(
      map((x: unknown) => (x instanceof DialogCloseResult ? undefined : <any>x))
    );
  }

  setup(
    org: string,
    version: LibraryVersionViewModel,
    tasks: LibraryEntryNode[]
  ): void {
    this.data.memberships.getMembershipUsersAsync(org).subscribe((members) => {
      this.members.set(members);
      this.tasks.set(tasks);
      this.pmIds.set([this.userId()!]);
      this.owner.set(org);
      this.version.set(version);
      this.projectTitle.set(version.title);
      this.disciplines.update((disciplines) => {
        disciplines = this.catService.buildDisciplines(version.disciplines);

        this.catService.renumber(disciplines);
        return [...disciplines];
      });
      this.loading.set(false);
    });
  }

  //make a computed one day, but for now it seems arrays in modals dont trigger
  canContinue(): boolean {
    const view = this.view();
    const category = this.category();
    const title = this.projectTitle();
    const disciplines = this.disciplines();

    if (view === 0) {
      return category !== undefined && title.trim() !== '';
    }
    if (view === 1) {
      return disciplines.some((x) => x.selected);
    }
    return true;
  }

  //make a computed one day, but for now it seems arrays in modals dont trigger
  nextButtonLabel(): string {
    const view = this.view();
    const hasDisciplines = this.disciplines().some((x) => x.selected);

    if (view === 2) return hasDisciplines ? 'General.Next' : 'General.Skip';

    return 'General.Next';
  }

  back(): void {
    this.view.update((x) => x - 1);
  }

  next(): void {
    this.view.update((x) => x + 1);
  }
}
