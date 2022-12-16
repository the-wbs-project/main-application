import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Select, Store } from '@ngxs/store';
import { ChangeTaskDescription } from '@wbs/components/projects/actions';
import { WbsNode } from '@wbs/core/models';
import { Observable } from 'rxjs';
import { TaskViewState } from '../../states';

@Component({
  selector: 'wbs-task-about',
  templateUrl: './task-about.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskAboutComponent {
  @Select(TaskViewState.current) current$!: Observable<WbsNode>;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly store: Store
  ) {}

  private get taskId(): string {
    return this.route.snapshot.params['taskId'];
  }

  saveDescription(newDescription: string): void {
    this.store.dispatch(new ChangeTaskDescription(this.taskId, newDescription));
  }
}
