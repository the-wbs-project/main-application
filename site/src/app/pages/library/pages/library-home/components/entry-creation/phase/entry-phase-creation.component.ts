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
import { Phase } from '@wbs/core/models';
import { CategorySelection } from '@wbs/core/view-models';
import { environment } from 'src/env';
import { CreationDialogService } from '../../../services';
import {
  DisciplineViewComponent,
  ReviewViewComponent,
  VersioningViewComponent,
} from '../components';
import { InfoViewComponent, PhaseViewComponent } from './components';

@Component({
  standalone: true,
  templateUrl: './entry-phase-creation.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [CreationDialogService],
  imports: [
    DialogButtonsComponent,
    DialogModule,
    DialogWrapperComponent,
    DisciplineViewComponent,
    InfoViewComponent,
    PhaseViewComponent,
    ReviewViewComponent,
    TranslateModule,
    VersioningViewComponent,
  ],
})
export class EntryPhaseCreationComponent extends DialogContentBase {
  readonly service = inject(CreationDialogService);
  //
  //  Constants
  //
  readonly steps = [
    { label: 'LibraryCreate.Step_Title', icon: faInfo },
    { label: 'General.Phase', icon: faDiagramSubtask },
    { label: 'General.Disciplines', icon: faPeople, isOptional: true },
    { label: 'General.Versioning', icon: faCodeBranch, isOptional: true },
    { label: 'LibraryCreate.Step_Review', icon: faFloppyDisk },
  ];
  //
  //  Signals
  //
  readonly templateTitle = signal<string>('');
  readonly alias = signal<string>(environment.initialVersionAlias);
  readonly phase = signal<string | Phase | undefined>(undefined);
  readonly visibility = signal<'public' | 'private'>('public');
  readonly disciplines = signal<CategorySelection[]>(
    this.service.createDisciplines()
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

    if (view === 0) return this.templateTitle().trim() !== '';
    if (view === 1) {
      const phase = this.phase();

      return (
        phase != undefined &&
        (typeof phase === 'string' || phase.label.trim() !== '')
      );
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
    const disciplines = this.disciplines().filter((x) => x.selected);
    this.service
      .createPhaseEntryAsync(
        this.templateTitle(),
        this.alias(),
        this.visibility(),
        this.phase()!,
        disciplines
      )
      .subscribe(() => this.dialog.close());
  }
}
