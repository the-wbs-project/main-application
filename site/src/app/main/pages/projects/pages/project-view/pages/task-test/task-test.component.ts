import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Select } from '@ngxs/store';
import { WbsNode } from '@wbs/core/models';
import { Observable } from 'rxjs';
import { TasksState } from '../../states';

@Component({
  standalone: true,
  templateUrl: './task-test.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule],
})
export class TaskTestComponent {
  @Select(TasksState.current) current$!: Observable<WbsNode>;
}
