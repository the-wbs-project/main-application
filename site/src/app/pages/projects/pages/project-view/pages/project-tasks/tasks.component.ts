import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  signal,
} from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { Navigate } from '@ngxs/router-plugin';
import { DialogModule } from '@progress/kendo-angular-dialog';
import { HeightDirective } from '@wbs/core/directives/height.directive';
import { SignalStore, WbsPhaseService } from '@wbs/core/services';
import { ProjectDisciplinesTreeComponent } from './components/discipline-tree';
import { ProjectPhaseTreeComponent } from './components/phase-tree';
import { ProjectStore } from '../../stores';

@Component({
  standalone: true,
  templateUrl: './tasks.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [WbsPhaseService],
  imports: [
    DialogModule,
    ProjectDisciplinesTreeComponent,
    ProjectPhaseTreeComponent,
    RouterModule,
    TranslateModule,
    HeightDirective,
  ],
})
export class ProjectTasksComponent {
  private readonly store = inject(SignalStore);

  readonly projectStore = inject(ProjectStore);
  readonly projectUrl = input.required<string[]>();

  readonly showDialog = signal(false);
  readonly containerHeight = signal(100);
  readonly dialogContainerHeight = signal(100);
  readonly view = signal<'phases' | 'disciplines'>('phases');

  navigateToTask(taskId: string): void {
    this.store.dispatch(new Navigate([...this.projectUrl(), 'tasks', taskId]));
  }
}
