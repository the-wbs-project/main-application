import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  computed,
  inject,
  input,
  model,
  output,
  signal,
} from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { TreeListModule } from '@progress/kendo-angular-treelist';
import {
  TreeButtonsFullscreenComponent,
  TreeButtonsTogglerComponent,
} from '@wbs/components/_utils/tree-buttons';
import { SignalStore, Transformers, TreeService } from '@wbs/core/services';
import { ProjectViewModel } from '@wbs/core/view-models';
import { TasksState } from '../../../../states';
import { TreeTypeButtonComponent } from '../tree-type-button';

@Component({
  standalone: true,
  selector: 'wbs-project-discipline-tree',
  templateUrl: './discipline-tree.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    TranslateModule,
    TreeButtonsFullscreenComponent,
    TreeButtonsTogglerComponent,
    TreeListModule,
    TreeTypeButtonComponent,
  ],
})
export class ProjectDisciplinesTreeComponent implements OnInit {
  private readonly store = inject(SignalStore);
  private readonly transformers = inject(Transformers);
  readonly treeService = new TreeService();
  //
  //  Inputs
  //
  readonly showFullscreen = input.required<boolean>();
  readonly containerHeight = input.required<number>();
  readonly view = model.required<'phases' | 'disciplines'>();
  readonly currentProject = input.required<ProjectViewModel>();
  //
  //  Constaints
  //
  readonly heightOffset = 50;
  readonly rowHeight = 31.5;
  //
  //  signals/models
  //
  readonly taskId = signal<string | undefined>(undefined);
  readonly nodes = this.store.select(TasksState.nodes);
  //
  //  Computed signals
  //
  readonly disciplines = computed(() =>
    this.transformers.nodes.discipline.view.run(
      this.currentProject().disciplines,
      this.nodes()!
    )
  );
  readonly pageSize = computed(() =>
    this.treeService.pageSize(
      this.containerHeight(),
      this.heightOffset,
      this.rowHeight
    )
  );
  //
  //  Outputs
  //
  readonly navigateToTask = output<string>();
  readonly goFullScreen = output<void>();

  ngOnInit(): void {
    this.treeService.expandedKeys = this.disciplines()
      .filter((x) => !x.parentId)
      .map((x) => x.id);
  }

  nav(): void {
    if (this.taskId()) this.navigateToTask.emit(this.taskId()!);
  }
}
