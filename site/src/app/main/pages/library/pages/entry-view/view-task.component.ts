import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
} from '@angular/core';
import { RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faDiagramSubtask } from '@fortawesome/pro-solid-svg-icons';
import { Navigate } from '@ngxs/router-plugin';
import { SignalStore, TitleService } from '@wbs/core/services';
import { NavigationComponent } from '@wbs/main/components/navigation.component';
import { FindByIdPipe } from '@wbs/main/pipes/find-by-id.pipe';
import { NavigationMenuService } from '@wbs/main/services';
import { EntryTitleComponent } from './components/entry-title';
import { TASK_NAVIGATION } from './models';
import { EntryViewState } from './states';
import { EntryTaskService } from './services';

@Component({
  standalone: true,
  templateUrl: './view-task.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    EntryTitleComponent,
    FindByIdPipe,
    FontAwesomeModule,
    NavigationComponent,
    RouterModule,
  ],
})
export class TaskViewComponent {
  private readonly navService = inject(NavigationMenuService);
  private readonly taskService = inject(EntryTaskService);

  readonly claims = input.required<string[]>();
  readonly entryUrl = input.required<string[]>();

  readonly task = this.store.select(EntryViewState.task);
  readonly title = computed(() => this.task()?.title ?? '');
  readonly links = computed(() =>
    this.navService.processLinks(TASK_NAVIGATION, this.claims())
  );

  readonly faDiagramSubtask = faDiagramSubtask;

  constructor(title: TitleService, private readonly store: SignalStore) {
    title.setTitle('Project', false);
  }

  navigate(route: string[]) {
    this.store.dispatch(
      new Navigate([...this.entryUrl(), 'tasks', this.task()!.id, ...route])
    );
  }

  titleChanged(title: string): void {
    console.log('hi');
    this.taskService.titleChangedAsync(title).subscribe();
  }
}
