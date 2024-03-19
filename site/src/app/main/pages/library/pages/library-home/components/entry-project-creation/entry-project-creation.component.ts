import { NgClass } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  computed,
  inject,
  model,
  output,
  signal,
  viewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faSpinner } from '@fortawesome/pro-duotone-svg-icons';
import {
  faDiagramSubtask,
  faFloppyDisk,
  faInfo,
  faPeople,
} from '@fortawesome/pro-solid-svg-icons';
import { TranslateModule } from '@ngx-translate/core';
import {
  DialogContentBase,
  DialogModule,
  DialogRef,
} from '@progress/kendo-angular-dialog';
import { TextBoxModule } from '@progress/kendo-angular-inputs';
import { StepperModule } from '@progress/kendo-angular-layout';
import { SignalStore } from '@wbs/core/services';
import { CategorySelection } from '@wbs/core/view-models';
import { DisciplineEditorComponent } from '@wbs/main/components/discipline-editor';
import { PhaseEditorComponent } from '@wbs/main/components/phase-editor';
import { ProjectCategoryDropdownComponent } from '@wbs/main/components/project-category-dropdown';
import { FindByIdPipe } from '@wbs/main/pipes/find-by-id.pipe';
import { CategorySelectionService } from '@wbs/main/services';
import { MetadataState } from '@wbs/main/states';
import { VisiblitySelectionComponent } from '../../../../components/visiblity-selection';
import { SaveSectionComponent } from './components/save-section';

@Component({
  standalone: true,
  templateUrl: './entry-project-creation.component.html',
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
    SaveSectionComponent,
    StepperModule,
    TextBoxModule,
    TranslateModule,
    VisiblitySelectionComponent,
  ],
  providers: [CategorySelectionService],
})
export class EntryProjectCreationComponent extends DialogContentBase {
  readonly done = output<void>();

  private readonly catService = inject(CategorySelectionService);
  private readonly store = inject(SignalStore);

  readonly mainView = viewChild<ElementRef<HTMLDivElement>>('mainView');
  readonly owner = signal<string | undefined>(undefined);
  readonly templateTitle = model<string>('');
  readonly category = model<string | undefined>(undefined);
  readonly visibility = model<'public' | 'private'>('public');
  readonly phases = model<CategorySelection[]>(
    this.catService.build(this.store.selectSnapshot(MetadataState.phases), [])
  );
  readonly disciplines = model<CategorySelection[]>(
    this.catService.build(
      this.store.selectSnapshot(MetadataState.disciplines),
      []
    )
  );
  readonly faSpinner = faSpinner;
  readonly view = model<number>(0);
  readonly categories = this.store.select(MetadataState.projectCategories);
  readonly saveState = signal<'saving' | 'saved' | 'error' | undefined>(
    undefined
  );
  readonly dir = signal<'left' | 'right' | undefined>('left');
  steps = [
    { label: 'LibraryCreate.Step_Title', icon: faInfo },
    { label: 'General.Phases', icon: faDiagramSubtask },
    { label: 'General.Disciplines', icon: faPeople, isOptional: true },
    { label: 'LibraryCreate.Step_Review', icon: faFloppyDisk },
  ];

  readonly disciplineReview = computed(() =>
    this.disciplines()
      .filter((x) => x.selected)
      .map((x) => x.label)
      .join(', ')
  );

  //make a computed one day, but for now it seems arrays in modals dont trigger
  canContinue(): boolean {
    const view = this.view();
    const phases = this.phases();
    const category = this.category();
    const title = this.templateTitle();

    if (view === 0) {
      return category !== undefined && title.trim() !== '';
    }
    if (view === 1) {
      return phases.some((x) => x.selected);
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

  constructor(dialog: DialogRef) {
    super(dialog);
  }

  back(): void {
    this.dir.set('left');
    this.view.update((x) => x - 1);
    this.mainView()?.nativeElement?.scrollTo(0, 0);
  }

  next(): void {
    this.dir.set('right');
    this.view.update((x) => x + 1);
    this.mainView()?.nativeElement?.scrollTo(0, 0);
  }
}
