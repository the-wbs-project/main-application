import { NgClass } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  signal,
} from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { SignalStore } from '@wbs/core/services';
import { TaskModalComponent } from '@wbs/main/components/task-modal';
import { WbsPhaseService } from '@wbs/main/services';
import { UiState } from '@wbs/main/states';
import { ProjectState, TasksState } from '../../../states';
import { ProjectDisciplinesTreeComponent } from './components/discipline-tree';
import { ProjectPhaseTreeComponent } from './components/phase-tree';

@Component({
  standalone: true,
  templateUrl: './tasks.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [WbsPhaseService],
  imports: [
    NgClass,
    ProjectDisciplinesTreeComponent,
    ProjectPhaseTreeComponent,
    TaskModalComponent,
    TranslateModule,
  ],
})
export class ProjectTasksComponent {
  private readonly store = inject(SignalStore);

  readonly claims = input.required<string[]>();
  readonly projectUrl = input.required<string[]>();
  readonly view = signal<'phases' | 'disciplines'>('phases');
  readonly project = this.store.select(ProjectState.current);
  readonly taskVm = this.store.select(TasksState.current);
  readonly width = this.store.select(UiState.mainContentWidth);
}
