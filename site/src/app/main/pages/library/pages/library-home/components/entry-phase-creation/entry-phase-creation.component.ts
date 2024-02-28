import { NgClass } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  Output,
  computed,
  inject,
  model,
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
import { Store } from '@ngxs/store';
import {
  DialogContentBase,
  DialogModule,
  DialogRef,
} from '@progress/kendo-angular-dialog';
import { TextBoxModule } from '@progress/kendo-angular-inputs';
import { StepperModule } from '@progress/kendo-angular-layout';
import { ProjectCategory } from '@wbs/core/models';
import { CategorySelection } from '@wbs/core/view-models';
import { DisciplineEditorComponent } from '@wbs/main/components/discipline-editor';
import { CategorySelectionService } from '@wbs/main/services';
import { MetadataState } from '@wbs/main/states';
import { VisiblitySelectionComponent } from '../visiblity-selection';
import { PhaseSectionComponent } from './components/phase-section';
import { SaveSectionComponent } from './components/save-section';

@Component({
  standalone: true,
  templateUrl: './entry-phase-creation.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    DialogModule,
    DisciplineEditorComponent,
    FontAwesomeModule,
    FormsModule,
    NgClass,
    PhaseSectionComponent,
    SaveSectionComponent,
    StepperModule,
    TextBoxModule,
    TranslateModule,
    VisiblitySelectionComponent,
  ],
  providers: [CategorySelectionService],
})
export class EntryPhaseCreationComponent extends DialogContentBase {
  @Output() readonly done = new EventEmitter<void>();

  private readonly catService = inject(CategorySelectionService);
  private readonly store = inject(Store);

  readonly mainView = viewChild<ElementRef<HTMLDivElement>>('mainView');
  readonly owner = signal<string | undefined>(undefined);
  readonly templateTitle = model<string>('');
  readonly phase = model<ProjectCategory | undefined>(undefined);
  readonly visibility = model<'public' | 'private'>('public');
  readonly disciplines = model<CategorySelection[]>(
    this.catService.build(
      this.store.selectSnapshot(MetadataState.disciplines),
      []
    )
  );
  readonly faSpinner = faSpinner;
  readonly view = model<number>(0);
  readonly saveState = signal<'saving' | 'saved' | 'error' | undefined>(
    undefined
  );
  readonly dir = signal<'left' | 'right' | undefined>('left');
  steps = [
    { label: 'LibraryCreate.Step_Title', icon: faInfo },
    { label: 'General.Phase', icon: faDiagramSubtask },
    { label: 'General.Disciplines', icon: faPeople, isOptional: true },
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

  canContinue(): boolean {
    const view = this.view();

    if (view === 0) {
      return this.templateTitle().trim() !== '';
    }
    if (view === 1) {
      const phase = this.phase();

      return (
        phase != undefined &&
        (typeof phase === 'string' || phase.label.trim() !== '')
      );
    }
    return true;
  }

  nextButtonLabel(): string {
    const view = this.view();
    const hasDisciplines = this.disciplines().some((x) => x.selected);

    if (view === 2) return hasDisciplines ? 'General.Next' : 'General.Skip';

    return 'General.Next';
  }
}
