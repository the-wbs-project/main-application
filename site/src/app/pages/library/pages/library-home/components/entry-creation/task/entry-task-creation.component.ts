import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  model,
  signal,
} from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faCodeBranch,
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
import { VisibilitySelectionComponent } from '@wbs/components/_utils/visiblity-selection';
import { DialogButtonsComponent } from '@wbs/components/dialog-buttons';
import { DialogWrapperComponent } from '@wbs/components/dialog-wrapper';
import { DisciplineEditorComponent } from '@wbs/components/discipline-editor';
import { CategoryService } from '@wbs/core/services';
import { CategorySelection } from '@wbs/core/view-models';
import { CreationDialogService } from '../../../services';
import { SaveSectionComponent } from '../components/save-section';
import { SavingEntryComponent } from '../components/saving-entry.component';
import { VersioningComponent } from '../components/versioning.component';
import { TitleFormComponent } from './components/title-form';

@Component({
  standalone: true,
  templateUrl: './entry-task-creation.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [CreationDialogService],
  imports: [
    DialogButtonsComponent,
    DialogModule,
    DialogWrapperComponent,
    DisciplineEditorComponent,
    FontAwesomeModule,
    SaveSectionComponent,
    SavingEntryComponent,
    TitleFormComponent,
    TranslateModule,
    VersioningComponent,
    VisibilitySelectionComponent,
  ],
})
export class EntryTaskCreationComponent extends DialogContentBase {
  private readonly catService = inject(CategoryService);
  readonly service = inject(CreationDialogService);

  readonly templateTitle = model<string>('');
  readonly mainTaskTitle = model<string>('');
  readonly alias = signal<string>('Initial Version');
  readonly visibility = model<'public' | 'private'>('public');
  readonly syncTitles = model<boolean>(false);
  readonly disciplines = model<CategorySelection[]>(
    this.catService.buildDisciplines([])
  );
  readonly view = model<number>(0);
  steps = [
    { label: 'LibraryCreate.Step_Title', icon: faInfo },
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
    //
    //  No pressing buttons if saving
    //
    if (view === this.steps.length - 1)
      return this.service.saveState.state() !== 'saving';

    if (view > 0) return true;

    const synced = this.syncTitles();
    const templateTitle = this.templateTitle().trim();
    const mainTaskTitle = this.mainTaskTitle().trim();

    if (synced) return templateTitle !== '';

    return templateTitle !== '' && mainTaskTitle !== '';
  });

  readonly nextButtonLabel = computed(() => {
    const view = this.view();
    const hasDisciplines = this.disciplines().some((x) => x.selected);

    if (view === 1) return hasDisciplines ? 'General.Next' : 'General.Skip';
    if (view === this.steps.length - 1) return 'General.Save';

    return 'General.Next';
  });

  constructor(dialog: DialogRef) {
    super(dialog);
  }

  back(): void {
    this.view.update((x) => x - 1);
  }

  next(): void {
    if (this.view() < this.steps.length - 1) {
      this.view.update((x) => x + 1);
    } else {
      this.service
        .createTaskEntryAsync(
          this.templateTitle(),
          this.mainTaskTitle(),
          this.alias(),
          this.visibility(),
          this.disciplines()
        )
        .subscribe(() => this.dialog.close());
    }
  }
}
