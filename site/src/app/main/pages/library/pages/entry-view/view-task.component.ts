import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faDiagramSubtask } from '@fortawesome/pro-solid-svg-icons';
import { SignalStore, TitleService } from '@wbs/core/services';
import { NavigationComponent } from '@wbs/main/components/navigation.component';
import { FindByIdPipe } from '@wbs/main/pipes/find-by-id.pipe';
import { NavMenuProcessPipe } from '@wbs/main/pipes/nav-menu-process.pipe';
import { TASK_NAVIGATION } from './models';
import { EntryViewState } from './states';
import { Navigate } from '@ngxs/router-plugin';

@Component({
  standalone: true,
  templateUrl: './view-task.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    FindByIdPipe,
    FontAwesomeModule,
    NavigationComponent,
    NavMenuProcessPipe,
    RouterModule,
  ],
})
export class TaskViewComponent {
  readonly claims = input.required<string[]>();
  readonly entry = this.store.select(EntryViewState.entry);
  readonly version = this.store.select(EntryViewState.version);
  readonly task = this.store.select(EntryViewState.task);
  readonly links = TASK_NAVIGATION;
  readonly faDiagramSubtask = faDiagramSubtask;

  constructor(title: TitleService, private readonly store: SignalStore) {
    title.setTitle('Project', false);
  }

  navigate(route: string[]) {
    this.store.dispatch(
      new Navigate([
        '/' + this.entry()!.owner,
        'library',
        'view',
        this.entry()!.id,
        this.version()!.version,
        'tasks',
        this.task()!.id,
        ...route,
      ])
    );
  }
}
