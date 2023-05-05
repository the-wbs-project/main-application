import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { faUserMinus } from '@fortawesome/pro-solid-svg-icons';
import { Store } from '@ngxs/store';
import { OrganizationState } from '@wbs/core/states';

@Component({
  selector: 'wbs-project-assigned-list',
  templateUrl: './assigned-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectAssignedListComponent {
  @Input() ids?: string[] | null;

  readonly faUserMinus = faUserMinus;
  readonly users$ = this.store.select(OrganizationState.users);

  constructor(private readonly store: Store) {}
}
