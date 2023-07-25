import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { WbsNode } from '@wbs/core/models';
import { Observable } from 'rxjs';
import { TasksState } from '../../states';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  templateUrl: './task-test.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule]
})
export class TaskTestComponent {
  @Select(TasksState.current) current$!: Observable<WbsNode>;
}
