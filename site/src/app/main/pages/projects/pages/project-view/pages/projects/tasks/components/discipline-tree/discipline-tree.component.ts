import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
  computed,
  input,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { TranslateModule } from '@ngx-translate/core';
import { Store } from '@ngxs/store';
import {
  SelectableSettings,
  TreeListModule,
} from '@progress/kendo-angular-treelist';
import { Project } from '@wbs/core/models';
import { Transformers } from '@wbs/main/services';
import { TasksState } from '../../../../../states';
import { DisciplineIdsPipe } from './discipline-ids.pipe';
import { SignalStore } from '@wbs/core/services';

@Component({
  standalone: true,
  selector: 'wbs-project-discipline-tree',
  templateUrl: './discipline-tree.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DisciplineIdsPipe, TranslateModule, TreeListModule],
})
export class ProjectDisciplinesTreeComponent implements OnInit {
  expandedKeys: string[] = [];
  taskId?: string;
  settings: SelectableSettings = {
    enabled: true,
    mode: 'row',
    multiple: false,
    drag: false,
    readonly: false,
  };

  readonly project = input.required<Project>();
  readonly nodes = this.store.select(TasksState.nodes);
  readonly disciplines = computed(() =>
    this.transformers.nodes.discipline.view.run(this.project(), this.nodes()!)
  );

  constructor(
    private readonly store: SignalStore,
    private readonly transformers: Transformers
  ) {}

  ngOnInit(): void {
    this.expandedKeys =
      this.project().disciplines.map((d) => {
        if (typeof d === 'string') return d;

        return d.id;
      }) ?? [];
  }
}
