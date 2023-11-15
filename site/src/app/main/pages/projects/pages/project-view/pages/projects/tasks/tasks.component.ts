import { NgClass } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  signal,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { TranslateModule } from '@ngx-translate/core';
import { Store } from '@ngxs/store';
import { WbsPhaseService } from '@wbs/main/services';
import { TaskModalComponent } from '../../../components/task-modal/task-modal.component';
import { ProjectState } from '../../../states';
import { ProjectDisciplinesTreeComponent } from './components/discipline-tree/discipline-tree.component';
import { ProjectPhaseTreeComponent } from './components/phase-tree/phase-tree.component';

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
  @Input({ required: true }) claims!: string[];

  readonly view = signal<'phases' | 'disciplines'>('phases');
  readonly project = toSignal(this.store.select(ProjectState.current));

  constructor(private readonly store: Store) {}
}
