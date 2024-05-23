import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
  signal,
} from '@angular/core';
import { AlertComponent } from '@wbs/components/_utils/alert.component';
import { PhaseEditorComponent } from '@wbs/components/phase-editor';
import { CategoryService } from '@wbs/core/services';
import { CategorySelection } from '@wbs/core/view-models';
import { ProjectCreateStore } from '../project-create.store';

@Component({
  standalone: true,
  selector: 'wbs-project-create-phases',
  template: `<div class="d-flex flex-flow-col h-100">
    <div class="text-start mg-t-10 w-100 flex-fill">
      <div class="tx-12">
        <wbs-alert
          type="info"
          [dismissible]="false"
          message="ProjectCreate.Phases_Description"
        />
      </div>
      <wbs-phase-editor
        [categories]="phases()"
        (categoriesChange)="changed($event)"
      />
    </div>
  </div> `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AlertComponent, PhaseEditorComponent],
})
export class ProjectCreatePhasesComponent implements OnInit {
  private readonly categoryService = inject(CategoryService);
  private readonly store = inject(ProjectCreateStore);

  readonly phases = signal<CategorySelection[]>([]);

  ngOnInit(): void {
    this.phases.set(this.categoryService.buildPhases(this.store.phases()));
  }

  changed(phases: CategorySelection[]): void {
    this.store.phases.set(this.categoryService.extract(phases, []).categories);
  }
}
