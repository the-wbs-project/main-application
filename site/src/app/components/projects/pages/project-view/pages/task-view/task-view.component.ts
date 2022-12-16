import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Select, Store } from '@ngxs/store';
import { TitleService } from '@wbs/core/services';
import { WbsNodeView } from '@wbs/core/view-models';
import { Observable } from 'rxjs';
import { ChangeTaskTitle } from '../../../../actions';
import { TASK_MENU_ITEMS, TASK_PAGE_VIEW_TYPE } from '../../models';
import { TaskViewState } from '../../states';

@Component({
  templateUrl: './task-view.component.html',
  styleUrls: ['./task-view.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class TaskViewComponent {
  @Select(TaskViewState.view) current$!: Observable<WbsNodeView>;
  @Select(TaskViewState.parent) parent$!: Observable<WbsNodeView>;
  @Select(TaskViewState.pageView) pageView$!: Observable<TASK_PAGE_VIEW_TYPE>;

  readonly links = TASK_MENU_ITEMS.links;

  constructor(
    title: TitleService,
    private readonly route: ActivatedRoute,
    private readonly store: Store
  ) {
    title.setTitle('Project', false);
  }

  private get taskId(): string {
    return this.route.snapshot.params['taskId'];
  }

  saveTitle(newTitle: string): void {
    this.store.dispatch(new ChangeTaskTitle(this.taskId, newTitle));
  }
}
