import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from '@angular/core';
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
import { DialogButtonsComponent } from '@wbs/components/dialog-buttons';
import { DialogWrapperComponent } from '@wbs/components/dialog-wrapper';
import { CategoryService } from '@wbs/core/services';
import { CategorySelection } from '@wbs/core/view-models';
import { CreationDialogService } from '../../../services';
import {
  DisciplineViewComponent,
  ReviewViewComponent,
  VersioningViewComponent,
} from '../components';
import { TitleViewComponent } from './components';

@Component({
  standalone: true,
  templateUrl: './entry-task-creation.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [CreationDialogService],
  imports: [
    DialogButtonsComponent,
    DialogModule,
    DialogWrapperComponent,
    DisciplineViewComponent,
    ReviewViewComponent,
    TitleViewComponent,
    TranslateModule,
    VersioningViewComponent,
  ],
})
export class EntryTaskCreationComponent extends DialogContentBase {
  private readonly catService = inject(CategoryService);
  readonly service = inject(CreationDialogService);
  //
  //  Constants
  //
  steps = [
    { label: 'LibraryCreate.Step_Title', icon: faInfo },
    { label: 'General.Disciplines', icon: faPeople, isOptional: true },
    { label: 'General.Versioning', icon: faCodeBranch, isOptional: true },
    { label: 'LibraryCreate.Step_Review', icon: faFloppyDisk },
  ];
  //
  //  Signals
  //
  readonly templateTitle = signal<string>('');
  readonly mainTaskTitle = signal<string>('');
  readonly alias = signal<string>('Initial Version');
  readonly visibility = signal<'public' | 'private'>('public');
  readonly syncTitles = signal<boolean>(false);
  readonly disciplines = signal<CategorySelection[]>(
    this.catService.buildDisciplines([])
  );
  readonly view = signal<number>(0);
  //
  //  Computed
  //
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

  constructor(dialog: DialogRef) {
    super(dialog);
  }

  back(): void {
    this.view.update((x) => x - 1);
  }

  next(): void {
    this.view.update((x) => x + 1);
  }

  save(): void {
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
