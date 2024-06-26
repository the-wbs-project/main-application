import { NgClass } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  model,
  output,
  signal,
} from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faSpinner } from '@fortawesome/pro-duotone-svg-icons';
import {
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
import { StepperModule } from '@progress/kendo-angular-layout';
import { VisibilitySelectionComponent } from '@wbs/components/_utils/visiblity-selection';
import { DisciplineEditorComponent } from '@wbs/components/discipline-editor';
import { ScrollToTopDirective } from '@wbs/core/directives/scrollToTop.directive';
import { CategoryService } from '@wbs/core/services';
import { CategorySelection } from '@wbs/core/view-models';
import { SaveSectionComponent } from './components/save-section';
import { TitleFormComponent } from './components/title-form';

@Component({
  standalone: true,
  templateUrl: './entry-task-creation.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ButtonModule,
    DialogModule,
    DisciplineEditorComponent,
    FontAwesomeModule,
    NgClass,
    SaveSectionComponent,
    ScrollToTopDirective,
    StepperModule,
    TitleFormComponent,
    TranslateModule,
    VisibilitySelectionComponent,
  ],
})
export class EntryTaskCreationComponent extends DialogContentBase {
  private readonly catService = inject(CategoryService);

  type?: string;
  readonly owner = signal<string | undefined>(undefined);
  readonly templateTitle = model<string>('');
  readonly mainTaskTitle = model<string>('');
  readonly visibility = model<'public' | 'private'>('public');
  readonly syncTitles = model<boolean>(false);
  readonly disciplines = model<CategorySelection[]>(
    this.catService.buildDisciplines([])
  );
  readonly done = output<void>();
  readonly faSpinner = faSpinner;
  readonly view = model<number>(0);
  readonly saveState = signal<'saving' | 'saved' | 'error' | undefined>(
    undefined
  );
  steps = [
    { label: 'LibraryCreate.Step_Title', icon: faInfo },
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

    if (view > 0) return true;

    const synced = this.syncTitles();
    const templateTitle = this.templateTitle().trim();
    const mainTaskTitle = this.mainTaskTitle().trim();

    if (synced) return templateTitle !== '';

    return templateTitle !== '' && mainTaskTitle !== '';
  }

  //make a computed one day, but for now it seems arrays in modals dont trigger
  nextButtonLabel(): string {
    const view = this.view();
    const hasDisciplines = this.disciplines().some((x) => x.selected);

    if (view === 1) return hasDisciplines ? 'General.Next' : 'General.Skip';

    return 'General.Next';
  }

  constructor(dialog: DialogRef) {
    super(dialog);
  }

  back(): void {
    this.view.update((x) => x - 1);
  }

  next(): void {
    this.view.update((x) => x + 1);
  }
}
