import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from '@angular/core';
import {
  faCodeBranch,
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
import { DialogButtonsComponent } from '@wbs/components/dialog-buttons';
import { DialogWrapperComponent } from '@wbs/components/dialog-wrapper';
import { MetadataStore } from '@wbs/core/store';
import { CategorySelection } from '@wbs/core/view-models';
import { FindByIdPipe } from '@wbs/pipes/find-by-id.pipe';
import { CreationDialogService } from '../../../services';
import {
  DisciplineViewComponent,
  ReviewViewComponent,
  VersioningViewComponent,
} from '../components';
import {
  CategoryViewComponent,
  InfoViewComponent,
  PhaseViewComponent,
} from './components';

@Component({
  standalone: true,
  templateUrl: './entry-project-creation.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [CreationDialogService],
  imports: [
    CategoryViewComponent,
    DialogButtonsComponent,
    DialogModule,
    DialogWrapperComponent,
    DisciplineViewComponent,
    FindByIdPipe,
    InfoViewComponent,
    PhaseViewComponent,
    ReviewViewComponent,
    TranslateModule,
    VersioningViewComponent,
  ],
})
export class EntryProjectCreationComponent extends DialogContentBase {
  readonly service = inject(CreationDialogService);
  readonly categories = inject(MetadataStore).categories.projectCategories;
  //
  //  Constants
  //
  readonly steps = [
    { label: 'LibraryCreate.Step_Title', icon: faInfo },
    { label: 'LibraryCreate.ProjectCategory', icon: faInfo },
    { label: 'General.Phases', icon: faDiagramSubtask, isOptional: true },
    { label: 'General.Disciplines', icon: faPeople, isOptional: true },
    { label: 'General.Versioning', icon: faCodeBranch, isOptional: true },
    { label: 'LibraryCreate.Step_Review', icon: faFloppyDisk },
  ];
  //
  //  Signals
  //
  readonly templateTitle = signal<string>('');
  readonly category = signal<string | undefined>(undefined);
  readonly alias = signal<string>('Initial Version');
  readonly visibility = signal<'public' | 'private'>('public');
  readonly phases = signal<CategorySelection[]>(this.service.createPhases());
  readonly disciplines = signal<CategorySelection[]>(
    this.service.createDisciplines()
  );
  readonly view = signal<number>(0);
  //
  //  Computed
  //
  readonly canContinue = computed(() => {
    const view = this.view();
    const category = this.category();
    const title = this.templateTitle();

    if (view === 0) {
      return title.trim() !== '';
    }

    //
    //  No pressing buttons if saving
    //
    if (view === this.steps.length - 1)
      return this.service.saveState.state() !== 'saving';

    return true;
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
