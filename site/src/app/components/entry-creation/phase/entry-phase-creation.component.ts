import { NgClass } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  output,
  computed,
  inject,
  model,
  signal,
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
import { ButtonModule } from '@progress/kendo-angular-buttons';
import {
  DialogContentBase,
  DialogModule,
  DialogRef,
} from '@progress/kendo-angular-dialog';
import { TextBoxModule } from '@progress/kendo-angular-inputs';
import { StepperModule } from '@progress/kendo-angular-layout';
import { VisibilitySelectionComponent } from '@wbs/components/_utils/visiblity-selection';
import { DisciplineEditorComponent } from '@wbs/components/discipline-editor';
import { ScrollToTopDirective } from '@wbs/core/directives/scrollToTop.directive';
import { Phase } from '@wbs/core/models';
import { CategoryService } from '@wbs/core/services';
import { CategorySelection } from '@wbs/core/view-models';
import { PhaseSelectionComponent } from './phase-section';
import { SaveSectionComponent } from './save-section';

@Component({
  standalone: true,
  templateUrl: './entry-phase-creation.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ButtonModule,
    DialogModule,
    DisciplineEditorComponent,
    FontAwesomeModule,
    FormsModule,
    NgClass,
    PhaseSelectionComponent,
    SaveSectionComponent,
    ScrollToTopDirective,
    StepperModule,
    TextBoxModule,
    TranslateModule,
    VisibilitySelectionComponent,
  ],
})
export class EntryPhaseCreationComponent extends DialogContentBase {
  readonly done = output<void>();

  private readonly catService = inject(CategoryService);

  readonly owner = signal<string | undefined>(undefined);
  readonly templateTitle = model<string>('');
  readonly phase = model<string | Phase | undefined>(undefined);
  readonly visibility = model<'public' | 'private'>('public');
  readonly disciplines = model<CategorySelection[]>(
    this.catService.buildDisciplines([])
  );
  readonly faSpinner = faSpinner;
  readonly view = model<number>(0);
  readonly saveState = signal<'saving' | 'saved' | 'error' | undefined>(
    undefined
  );
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

  //make a computed one day, but for now it seems arrays in modals dont trigger
  canContinue(): boolean {
    const view = this.view();

    if (view === 0) return this.templateTitle().trim() !== '';
    if (view === 1) {
      const phase = this.phase();

      return (
        phase != undefined &&
        (typeof phase === 'string' || phase.label.trim() !== '')
      );
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
