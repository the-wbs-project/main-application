import { NgClass } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Output,
  computed,
  inject,
  model,
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
import { Store } from '@ngxs/store';
import {
  DialogContentBase,
  DialogModule,
  DialogRef,
} from '@progress/kendo-angular-dialog';
import { StepperModule } from '@progress/kendo-angular-layout';
import { CategorySelection } from '@wbs/core/view-models';
import { DisciplineEditorComponent } from '@wbs/main/components/discipline-editor';
import { CategorySelectionService } from '@wbs/main/services';
import { MetadataState } from '@wbs/main/states';
import { VisiblitySelectionComponent } from '../visiblity-selection';
import { SaveSectionComponent } from './components/save-section';
import { TitleFormComponent } from './components/title-form';

@Component({
  standalone: true,
  templateUrl: './entry-task-creation.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    DialogModule,
    DisciplineEditorComponent,
    FontAwesomeModule,
    NgClass,
    SaveSectionComponent,
    StepperModule,
    TitleFormComponent,
    TranslateModule,
    VisiblitySelectionComponent,
  ],
  providers: [CategorySelectionService],
})
export class EntryTaskCreationComponent extends DialogContentBase {
  @Output() readonly done = new EventEmitter<void>();

  private readonly catService = inject(CategorySelectionService);
  private readonly store = inject(Store);

  type?: string;
  readonly owner = signal<string | undefined>(undefined);
  readonly templateTitle = model<string>('');
  readonly mainTaskTitle = model<string>('');
  readonly visibility = model<'public' | 'private'>('public');
  readonly syncTitles = model<boolean>(false);
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
  }

  next(): void {
    this.dir.set('right');
    this.view.update((x) => x + 1);
  }

  canContinue(): boolean {
    const view = this.view();

    if (view > 0) return true;

    const synced = this.syncTitles();
    const templateTitle = this.templateTitle().trim();
    const mainTaskTitle = this.mainTaskTitle().trim();

    if (synced) return templateTitle !== '';

    return templateTitle !== '' && mainTaskTitle !== '';
  }

  nextButtonLabel(): string {
    const view = this.view();
    const hasDisciplines = this.disciplines().some((x) => x.selected);

    if (view === 1) return hasDisciplines ? 'General.Next' : 'General.Skip';

    return 'General.Next';
  }
}
