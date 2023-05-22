import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { WbsNode } from '@wbs/core/models';
import { Observable } from 'rxjs';
import { TasksState } from '../../states';

@Component({
  templateUrl: './task-test.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskTestComponent {
  @Select(TasksState.current) current$!: Observable<WbsNode>;
  constructor(store: Store) {}
}
