import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  signal,
} from '@angular/core';
import { RouterModule } from '@angular/router';
import { SignalStore, WbsPhaseService } from '@wbs/core/services';
import { ProjectState } from '../../states';
import { ProjectDisciplinesTreeComponent } from './components/discipline-tree';
import { ProjectPhaseTreeComponent } from './components/phase-tree';
import { TreeTypeButtonComponent } from './components/tree-type-button/tree-type-button.component';
import { DialogModule } from '@progress/kendo-angular-dialog';
import { TranslateModule } from '@ngx-translate/core';
import { TreeHeightDirective } from '@wbs/core/directives/tree-height.directive';
import { Navigate } from '@ngxs/router-plugin';

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
    TreeHeightDirective,
  ],
})
export class ProjectTasksComponent {
  private readonly store = inject(SignalStore);

  readonly projectUrl = input.required<string[]>();

  readonly showDialog = signal(false);
  readonly containerHeight = signal(100);
  readonly dialogContainerHeight = signal(100);
  readonly view = signal<'phases' | 'disciplines'>('phases');

  readonly claims = this.store.select(ProjectState.claims);
  readonly project = this.store.select(ProjectState.current);

  navigateToTask(taskId: string): void {
    this.store.dispatch(new Navigate([...this.projectUrl(), 'tasks', taskId]));
  }
}
