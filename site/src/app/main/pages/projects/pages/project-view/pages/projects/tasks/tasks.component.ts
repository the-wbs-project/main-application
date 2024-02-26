import { NgClass } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  input,
  signal,
} from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { SignalStore } from '@wbs/core/services';
import { WbsPhaseService } from '@wbs/main/services';
import { TaskModalComponent } from '../../../components/task-modal/task-modal.component';
import { ProjectState } from '../../../states';
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
  readonly claims = input.required<string[]>();
  readonly view = signal<'phases' | 'disciplines'>('phases');
  readonly project = this.store.select(ProjectState.current);

  constructor(private readonly store: SignalStore) {}
}
