import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  model,
  signal,
} from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonModule } from '@progress/kendo-angular-buttons';
import {
  DialogContentBase,
  DialogModule,
  DialogRef,
  DialogService,
} from '@progress/kendo-angular-dialog';
import { TreeListModule } from '@progress/kendo-angular-treelist';
import { AlertComponent } from '@wbs/components/_utils/alert.component';
import { SaveButtonComponent } from '@wbs/components/_utils/save-button.component';
import { TreeButtonsTogglerComponent } from '@wbs/components/_utils/tree-buttons';
import { HeightDirective } from '@wbs/core/directives/height.directive';
import { SaveService, Transformers, TreeService } from '@wbs/core/services';
import { UiStore } from '@wbs/core/store';
import { ProjectStore } from '../../../../stores';
import { PhaseTreeReorderService } from '../../services';
import { AbsCheckboxComponent, AbsSelectButtonComponent } from './components';
import { AbsTreeItem } from './models';
import { ProjectTaskService } from '../../../../services';

@Component({
  standalone: true,
  templateUrl: './abs-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [PhaseTreeReorderService],
  imports: [
    AbsCheckboxComponent,
    AbsSelectButtonComponent,
    AlertComponent,
    ButtonModule,
    DialogModule,
    FontAwesomeModule,
    HeightDirective,
    SaveButtonComponent,
    TranslateModule,
    TreeButtonsTogglerComponent,
    TreeListModule,
  ],
})
export class AbsDialogComponent extends DialogContentBase {
  private readonly transformers = inject(Transformers);
  private readonly store = inject(ProjectStore);
  private readonly taskService = inject(ProjectTaskService);

  readonly width = inject(UiStore).mainContentWidth;
  readonly treeService = new TreeService();
  readonly saveService = new SaveService();
  //
  //  Inputs
  //
  readonly view = model.required<'phases' | 'disciplines'>();
  readonly wbsAbs = model.required<'wbs' | 'abs'>();
  //
  //  Constaints
  //
  readonly heightOffset = 10;
  readonly rowHeight = 31.5;
  //
  //  signals/models
  //
  readonly containerHeight = signal(100);
  readonly tasks = signal<AbsTreeItem[]>([]);
  //
  //  Computed signals
  //
  readonly pageSize = computed(() =>
    this.treeService.pageSize(
      this.containerHeight(),
      this.heightOffset,
      this.rowHeight
    )
  );

  constructor(dialogRef: DialogRef) {
    super(dialogRef);
  }

  static launchAsync(
    dialogService: DialogService,
    expandedKeys: string[]
  ): void {
    const dialog = dialogService.open({
      content: AbsDialogComponent,
    });
    const comp = dialog.content.instance as AbsDialogComponent;

    comp.setup(expandedKeys);
  }

  private setup(expandedKeys: string[]): void {
    const tasks: AbsTreeItem[] = [];

    for (const task of this.store.viewModels() ?? []) {
      tasks.push({
        id: task.id,
        parentId: task.parentId,
        title: task.title,
        absFlag: task.absFlag,
        levelText: task.levelText,
      });
    }

    this.tasks.set(tasks);
    this.treeService.expandedKeys = expandedKeys;
  }

  protected selectLevels(levels: number): void {
    console.log(levels);
    this.tasks.update((tasks) => {
      for (const task of tasks) {
        console.log(task.levelText, task.levelText.split('.').length);

        if (task.levelText.split('.').length <= levels) {
          task.absFlag = 'set';
        } else {
          task.absFlag = undefined;
        }
      }
      console.log(structuredClone(tasks));

      this.transformers.nodes.phase.view.updateAbsFlags(tasks);

      console.log(tasks);

      return [...tasks];
    });
  }

  protected absFlagChanged(
    value: boolean,
    task: AbsTreeItem,
    tasks: AbsTreeItem[]
  ): void {
    task.absFlag = value ? 'set' : undefined;
    this.transformers.nodes.phase.view.updateAbsFlags(tasks);
  }

  protected save(): void {
    const ids = this.tasks()
      .filter((x) => x.absFlag === 'set')
      .map((x) => x.id);

    this.saveService
      .quickCall(this.taskService.changeTaskAbsBulk(ids))
      .subscribe(() => this.dialog.close());
  }
}
