import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Store } from '@ngxs/store';
import { TitleService } from '@wbs/core/services';
import { TASK_MENU_ITEMS } from '../../models';
import { TasksState } from '../../states';
import { faDiagramSubtask } from '@fortawesome/pro-solid-svg-icons';

@Component({
  templateUrl: './task-view.component.html',
  styleUrls: ['./task-view.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class TaskViewComponent {
  readonly current = toSignal(this.store.select(TasksState.current));
  readonly pageView = toSignal(this.store.select(TasksState.pageView));

  readonly links = TASK_MENU_ITEMS.links;
  readonly faDiagramSubtask = faDiagramSubtask;

  constructor(title: TitleService, private readonly store: Store) {
    title.setTitle('Project', false);
  }
}
