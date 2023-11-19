import {
  ChangeDetectionStrategy,
  Component,
  Input,
  computed,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Store } from '@ngxs/store';
import { Project } from '@wbs/core/models';
import { WbsTreeComponent } from '@wbs/main/components/wbs-tree';
import { Transformers } from '@wbs/main/services';
import { TasksState } from '../../../../../states';
import { DisciplineIdsPipe } from './discipline-ids.pipe';

@Component({
  standalone: true,
  selector: 'wbs-project-discipline-tree',
  templateUrl: './discipline-tree.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DisciplineIdsPipe, WbsTreeComponent],
})
export class ProjectDisciplinesTreeComponent {
  @Input({ required: true }) project?: Project;

  taskId?: string;

  readonly nodes = toSignal(this.store.select(TasksState.nodes));
  readonly disciplines = computed(() =>
    this.transformers.nodes.discipline.view.run(this.project!, this.nodes()!)
  );

  constructor(
    private readonly store: Store,
    private readonly transformers: Transformers
  ) {}
}
