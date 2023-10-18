import {
  ChangeDetectionStrategy,
  Component,
  Input,
  ViewEncapsulation,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faDiagramSubtask } from '@fortawesome/pro-solid-svg-icons';
import { Store } from '@ngxs/store';
import { TitleService } from '@wbs/core/services';
import { ProjectNavigationComponent } from '../../components/project-navigation/project-navigation.component';
import { TASK_MENU_ITEMS } from '../../models';
import { TasksState } from '../../states';

@Component({
  standalone: true,
  templateUrl: './task-view.component.html',
  styleUrls: ['./task-view.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [FontAwesomeModule, ProjectNavigationComponent, RouterModule],
})
export class TaskViewComponent {
  @Input({ required: true }) claims!: string[];

  readonly current = toSignal(this.store.select(TasksState.current));
  readonly links = TASK_MENU_ITEMS.links;
  readonly faDiagramSubtask = faDiagramSubtask;

  constructor(title: TitleService, private readonly store: Store) {
    title.setTitle('Project', false);
  }
}
