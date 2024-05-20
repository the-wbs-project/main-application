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

@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [WbsPhaseService],
  imports: [
    ProjectDisciplinesTreeComponent,
    ProjectPhaseTreeComponent,
    RouterModule,
    TreeTypeButtonComponent,
  ],
  template: `<div class="w-100 tx-center pd-t-15">
      <wbs-tree-type-button [(view)]="view" />
    </div>
    <div class="pd-15">
      @if (view() === 'phases') {
      <wbs-project-phase-tree
        [claims]="claims()"
        [project]="project()!"
        [projectUrl]="projectUrl()"
      />
      } @else if (view() === 'disciplines') {
      <wbs-project-discipline-tree [project]="project()!" />
      }
    </div>
    <router-outlet />`,
})
export class ProjectTasksComponent {
  private readonly store = inject(SignalStore);

  readonly claims = input.required<string[]>();
  readonly projectUrl = input.required<string[]>();
  readonly view = signal<'phases' | 'disciplines'>('phases');
  readonly project = this.store.select(ProjectState.current);
}
