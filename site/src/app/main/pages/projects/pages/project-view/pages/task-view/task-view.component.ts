import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faDiagramSubtask } from '@fortawesome/pro-solid-svg-icons';
import { Store } from '@ngxs/store';
import { TitleService } from '@wbs/core/services';
import { TASK_MENU_ITEMS } from '../../models';
import { ProjectState, TasksState } from '../../states';
import { ProjectNavigationComponent } from '../../components/project-navigation/project-navigation.component';

@Component({
  standalone: true,
  templateUrl: './task-view.component.html',
  styleUrls: ['./task-view.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [FontAwesomeModule, ProjectNavigationComponent, RouterModule],
})
export class TaskViewComponent {
  readonly current = toSignal(this.store.select(TasksState.current));
  readonly pageView = toSignal(this.store.select(TasksState.pageView));
  readonly roles = toSignal(this.store.select(ProjectState.roles));

  readonly links = TASK_MENU_ITEMS.links;
  readonly faDiagramSubtask = faDiagramSubtask;

  constructor(title: TitleService, private readonly store: Store) {
    title.setTitle('Project', false);
  }
}
