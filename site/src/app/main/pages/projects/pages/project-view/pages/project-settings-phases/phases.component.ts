import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
  input,
  signal,
} from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faCheck, faPlus } from '@fortawesome/pro-solid-svg-icons';
import { TranslateModule } from '@ngx-translate/core';
import { Store } from '@ngxs/store';
import { Category, ProjectCategory, SaveState } from '@wbs/core/models';
import { IdService, Resources } from '@wbs/core/services';
import { CategorySelection } from '@wbs/core/view-models';
import { CategoryDialogComponent } from '@wbs/main/components/category-dialog';
import { FadingMessageComponent } from '@wbs/main/components/fading-message.component';
import { PhaseEditorComponent } from '@wbs/main/components/phase-editor';
import { ProjectRolesComponent } from '@wbs/main/components/project-roles';
import { SaveButtonComponent } from '@wbs/main/components/save-button.component';
import { CategoryDialogResults } from '@wbs/main/models';
import {
  CategorySelectionService,
  CategoryState,
  WbsNodeService,
} from '@wbs/main/services';
import { TasksState } from '../../states';
import { PhasesChanged } from '../../actions';

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
  private readonly categoryState = inject(CategoryState);
  private readonly catService = inject(CategorySelectionService);
  private readonly resources = inject(Resources);
  private readonly store = inject(Store);
  private readonly wbsService = inject(WbsNodeService);

  readonly plusIcon = faPlus;
  readonly checkIcon = faCheck;
  readonly showAddDialog = signal(false);
  readonly saveState = signal<SaveState>('ready');
  readonly phases = signal<CategorySelection[]>([]);
  readonly isDirty = () => this.catService.isListDirty(this.phases());

  ngOnInit(): void {
    this.set();
  }

  create(results: CategoryDialogResults | undefined): void {
    this.showAddDialog.set(false);

    if (results == null) return;

    const item: CategorySelection = {
      id: IdService.generate(),
      isCustom: true,
      label: results.title,
      icon: results.icon,
      description: results.description,
      selected: true,
    };
    this.phases.update((list) => this.catService.add(list, item));
  }

  save(): void {
    const phases = this.phases();
    const cats = this.categoryState.phases;

    const tasks = this.store.selectSnapshot(TasksState.nodes)!;
    const existing: ProjectCategory[] = tasks
      .filter((x) => x.parentId == undefined)
      .sort((a, b) => a.order - b.order)
      .map((x) => {
        if (x.phaseIdAssociation != null) {
          const def = cats.find((c) => c.id == x.phaseIdAssociation);

          if (def) {
            if (this.resources.get(def.label) === x.title) return def.id;
          }
        }
        return <Category>{
          id: x.id,
          label: x.title,
          description: x.description,
          sameAs: x.phaseIdAssociation,
        };
      });
    this.store
      .dispatch(new PhasesChanged(this.catService.extract(phases, existing)))
      .subscribe(() => this.set());
  }

  private set(): void {
    this.phases.set(
      this.wbsService.getPhasesForEdit(
        this.store.selectSnapshot(TasksState.phases)!,
        'Projects.PhaseRemoveConfirm'
      )
    );
  }
}
