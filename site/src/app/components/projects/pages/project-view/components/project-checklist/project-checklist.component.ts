import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Store } from '@ngxs/store';
import { ProjectChecklistState } from '../../states';

@Component({
  selector: 'wbs-project-checklist',
  templateUrl: './project-checklist.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectChecklistComponent {
  private readonly store = inject(Store);
  readonly checklist = toSignal(
    this.store.select(ProjectChecklistState.results)
  );
}
