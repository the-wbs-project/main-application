import { NgClass } from '@angular/common';
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
  faLock,
  faPeople,
} from '@fortawesome/pro-solid-svg-icons';
import { TranslateModule } from '@ngx-translate/core';
import {
  DialogCloseResult,
  DialogContentBase,
  DialogModule,
  DialogRef,
  DialogService,
} from '@progress/kendo-angular-dialog';
import { TextBoxModule } from '@progress/kendo-angular-inputs';
import { StepperModule } from '@progress/kendo-angular-layout';
import { DataServiceFactory } from '@wbs/core/data-services';
import { ScrollToTopDirective } from '@wbs/core/directives/scrollToTop.directive';
import {
  LibraryEntryNode,
  LibraryEntryVersion,
  Member,
} from '@wbs/core/models';
import {
  CategorySelectionService,
  IdService,
  SignalStore,
} from '@wbs/core/services';
import { CategorySelection } from '@wbs/core/view-models';
import { VisibilitySelectionComponent } from '@wbs/components/_utils/visiblity-selection';
import { DisciplineEditorComponent } from '@wbs/components/discipline-editor';
import { PhaseEditorComponent } from '@wbs/components/phase-editor';
import { ProjectCategoryDropdownComponent } from '@wbs/components/project-category-dropdown';
import { FindByIdPipe } from '@wbs/pipes/find-by-id.pipe';
import { MembershipState } from '@wbs/main/states';
import { MetadataStore, UserStore } from '@wbs/store';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { RolesSectionComponent } from './components/roles-section';
import { SaveSectionComponent } from './components/save-section';

@Component({
  standalone: true,
  templateUrl: './project-creation-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    DialogModule,
    DisciplineEditorComponent,
    FindByIdPipe,
    FontAwesomeModule,
    FormsModule,
    NgClass,
    PhaseEditorComponent,
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
  private readonly catService = inject(CategorySelectionService);
  private readonly data = inject(DataServiceFactory);
  private readonly store = inject(SignalStore);
  private readonly userId = inject(UserStore).userId;

  readonly faSpinner = faSpinner;
  readonly loading = signal(true);
  readonly view = model<number>(0);
  readonly newId = IdService.generate();
  readonly owner = signal<string | undefined>(undefined);
  readonly members = signal<Member[]>([]);
  readonly approverIds = signal<string[]>([]);
  readonly pmIds = signal<string[]>([]);
  readonly smeIds = signal<string[]>([]);
  readonly categories = this.metadata.categories.projectCategories;
  readonly tasks = signal<LibraryEntryNode[]>([]);
  readonly projectTitle = model<string>('');
  readonly category = model<string | undefined>(undefined);
  readonly disciplines = model<CategorySelection[]>([]);
  readonly saveState = signal<'saving' | 'saved' | 'error' | undefined>(
    undefined
  );
  readonly dir = signal<'left' | 'right' | undefined>('left');
  steps = [
    { label: 'LibraryCreate.Step_Title', icon: faInfo },
    { label: 'General.Disciplines', icon: faPeople },
    { label: 'General.Roles', icon: faLock },
    { label: 'LibraryCreate.Step_Review', icon: faFloppyDisk },
  ];

  readonly approvalEnabled =
    this.store.selectSnapshot(MembershipState.organization)?.metadata
      ?.projectApprovalRequired ?? false;

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
    version: LibraryEntryVersion,
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
    version: LibraryEntryVersion,
    tasks: LibraryEntryNode[]
  ): void {
    this.data.memberships.getMembershipUsersAsync(org).subscribe((members) => {
      this.members.set(members);
      this.tasks.set(tasks);
      this.pmIds.set([this.userId()!]);
      this.owner.set(org);
      this.projectTitle.set(version.title);
      this.disciplines.update((disciplines) => {
        disciplines = this.catService.buildDisciplines([]);

        for (const x of version.disciplines) {
          if (typeof x === 'string') {
            disciplines.find((d) => d.id === x)!.selected = true;
          } else {
            disciplines.push({
              ...x,
              selected: true,
              isCustom: true,
            });
          }
        }
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
    this.dir.set('left');
    this.view.update((x) => x - 1);
  }

  next(): void {
    this.dir.set('right');
    this.view.update((x) => x + 1);
  }
}
