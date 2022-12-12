import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { WbsNode } from '@wbs/core/models';
import { Observable } from 'rxjs';
import { TaskViewState } from '../../states';

@Component({
  templateUrl: './task-test.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskTestComponent {
  @Select(TaskViewState.current) current$!: Observable<WbsNode>;
  constructor(store: Store) {}
}
