import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  computed,
  input,
} from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import {
  SelectableSettings,
  TreeListModule,
} from '@progress/kendo-angular-treelist';
import { TreeTogglerComponent } from '@wbs/components/_utils/tree-toggler.component';
import { SignalStore, Transformers, TreeService } from '@wbs/core/services';
import { ProjectViewModel } from '@wbs/core/view-models';
import { TasksState } from '../../../../states';
import { DisciplineIdsPipe } from './discipline-ids.pipe';

@Component({
  standalone: true,
  selector: 'wbs-project-discipline-tree',
  templateUrl: './discipline-tree.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    DisciplineIdsPipe,
    TranslateModule,
    TreeListModule,
    TreeTogglerComponent,
  ],
})
export class ProjectDisciplinesTreeComponent implements OnInit {
  taskId?: string;
  settings: SelectableSettings = {
    enabled: true,
    mode: 'row',
    multiple: false,
    drag: false,
    readonly: false,
  };

  readonly treeService = new TreeService();
  readonly project = input.required<ProjectViewModel>();
  readonly nodes = this.store.select(TasksState.nodes);
  readonly disciplines = computed(() =>
    this.transformers.nodes.discipline.view.run(
      this.project().disciplines,
      this.nodes()!
    )
  );

  constructor(
    private readonly store: SignalStore,
    private readonly transformers: Transformers
  ) {}

  ngOnInit(): void {
    this.treeService.expandedKeys =
      this.project().disciplines.map((d) => {
        if (typeof d === 'string') return d;

        return d.id;
      }) ?? [];
  }
}
