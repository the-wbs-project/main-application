import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  computed,
  inject,
  input,
  signal,
} from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faCheck, faPlus } from '@fortawesome/pro-solid-svg-icons';
import { TranslateModule } from '@ngx-translate/core';
import { Store } from '@ngxs/store';
import { Category, SaveState } from '@wbs/core/models';
import { IdService } from '@wbs/core/services';
import { CategorySelection } from '@wbs/core/view-models';
import { CategoryDialogComponent } from '@wbs/main/components/category-dialog';
import { FadingMessageComponent } from '@wbs/main/components/fading-message.component';
import { PhaseEditorComponent } from '@wbs/main/components/phase-editor';
import { SaveButtonComponent } from '@wbs/main/components/save-button.component';
import { CategorySelectionService, WbsNodeService } from '@wbs/main/services';
import { ProjectRolesComponent } from '../../../../components/project-roles';
import { TasksState } from '../../states';

@Component({
  standalone: true,
  templateUrl: './phases.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CategoryDialogComponent,
    FadingMessageComponent,
    FontAwesomeModule,
    PhaseEditorComponent,
    ProjectRolesComponent,
    SaveButtonComponent,
    TranslateModule,
  ],
  providers: [WbsNodeService],
})
export class PhasesComponent implements OnInit {
  private readonly catService = inject(CategorySelectionService);
  private readonly store = inject(Store);
  private readonly wbsService = inject(WbsNodeService);

  readonly plusIcon = faPlus;
  readonly checkIcon = faCheck;
  readonly cats = input.required<Category[]>();
  readonly showAddDialog = signal(false);
  readonly saveState = signal<SaveState>('ready');
  readonly phases = signal<CategorySelection[]>([]);
  readonly isDirty = computed(() => this.catService.isListDirty(this.phases()));

  ngOnInit(): void {
    this.set();
  }

  create(results: [string, string] | undefined): void {
    this.showAddDialog.set(false);

    if (results == null) return;

    const item: CategorySelection = {
      id: IdService.generate(),
      isCustom: true,
      label: results[0],
      icon: results[1],
      selected: true,
    };
    this.phases.update((list) => this.catService.add(list, item));
  }

  save(): void {
    //
  }

  private set(): void {
    this.phases.set(
      this.wbsService.getPhasesForEdit(
        this.cats(),
        this.store.selectSnapshot(TasksState.phases)!,
        'Projects.PhaseRemoveConfirm'
      )
    );
  }
}
