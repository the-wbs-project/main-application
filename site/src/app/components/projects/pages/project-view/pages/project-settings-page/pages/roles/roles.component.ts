import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Store } from '@ngxs/store';
import { ProjectState } from '@wbs/components/projects/states';
import { OrganizationState } from '@wbs/core/states';

@Component({
  templateUrl: './roles.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectSettingsRolesComponent {
  readonly approvers$ = this.store.select(ProjectState.approvers);
  readonly pms$ = this.store.select(ProjectState.pms);
  readonly smes$ = this.store.select(ProjectState.smes);
  readonly users$ = this.store.select(OrganizationState.users);

  constructor(private readonly store: Store) {}
}
