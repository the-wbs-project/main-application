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
import {
  faCodeBranch,
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
import { PhaseEditorComponent } from '@wbs/components/phase-editor';
import { ProjectCategoryDropdownComponent } from '@wbs/components/project-category-dropdown';
import { ScrollToTopDirective } from '@wbs/core/directives/scrollToTop.directive';
import { CategoryService } from '@wbs/core/services';
import { MetadataStore } from '@wbs/core/store';
import { CategorySelection } from '@wbs/core/view-models';
import { FindByIdPipe } from '@wbs/pipes/find-by-id.pipe';
import { SaveSectionComponent } from '../components/save-section';
import { SavingEntryComponent } from '../components/saving-entry.component';
import { VersioningComponent } from '../components/versioning.component';
import { EntryCreationService } from '../services';

@Component({
  standalone: true,
  templateUrl: './entry-project-creation.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [EntryCreationService],
  imports: [
    ButtonModule,
    DialogModule,
    DisciplineEditorComponent,
    FindByIdPipe,
    FontAwesomeModule,
    FormsModule,
    NgClass,
    PhaseEditorComponent,
    ProjectCategoryDropdownComponent,
    SaveSectionComponent,
    SavingEntryComponent,
    ScrollToTopDirective,
    StepperModule,
    TextBoxModule,
    TranslateModule,
    VersioningComponent,
    VisibilitySelectionComponent,
  ],
})
export class EntryProjectCreationComponent extends DialogContentBase {
  private readonly catService = inject(CategoryService);
  readonly service = inject(EntryCreationService);

  readonly templateTitle = model<string>('');
  readonly category = model<string | undefined>(undefined);
  readonly alias = signal<string>('Initial Version');
  readonly visibility = model<'public' | 'private'>('public');
  readonly phases = model<CategorySelection[]>(this.catService.buildPhases([]));
  readonly disciplines = model<CategorySelection[]>(
    this.catService.buildDisciplines([])
  );
  readonly view = model<number>(0);
  readonly categories = inject(MetadataStore).categories.projectCategories;
  readonly steps = [
    { label: 'LibraryCreate.Step_Title', icon: faInfo },
    { label: 'General.Phases', icon: faDiagramSubtask, isOptional: true },
    { label: 'General.Disciplines', icon: faPeople, isOptional: true },
    { label: 'General.Versioning', icon: faCodeBranch, isOptional: true },
    { label: 'LibraryCreate.Step_Review', icon: faFloppyDisk },
  ];

  readonly disciplineReview = computed(() =>
    this.disciplines()
      .filter((x) => x.selected)
      .map((x) => x.label)
      .join(', ')
  );

  readonly canContinue = computed(() => {
    const view = this.view();
    const category = this.category();
    const title = this.templateTitle();

    if (view === 0) {
      return category !== undefined && title.trim() !== '';
    }
    //
    //  No pressing buttons if saving
    //
    if (view === this.steps.length - 1)
      return this.service.saveState.state() !== 'saving';

    return true;
  });

  readonly nextButtonLabel = computed(() => {
    const view = this.view();
    const hasDisciplines = this.disciplines().some((x) => x.selected);

    if (view === 2) return hasDisciplines ? 'General.Next' : 'General.Skip';
    if (view === this.steps.length - 1) return 'General.Save';

    return 'General.Next';
  });

  constructor(dialog: DialogRef) {
    super(dialog);
  }

  stop(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
  }

  back(): void {
    this.view.update((x) => x - 1);
  }

  next(): void {
    if (this.view() < this.steps.length - 1) {
      this.view.update((x) => x + 1);
    } else {
      this.service
        .createProjectEntryAsync(
          this.templateTitle(),
          this.alias(),
          this.visibility(),
          this.category()!,
          this.phases(),
          this.disciplines()
        )
        .subscribe(() => this.dialog.close());
    }
  }
}
