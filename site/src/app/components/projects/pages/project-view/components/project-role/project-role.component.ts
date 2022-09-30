import {
  ChangeDetectionStrategy,
  Component,
  Input,
  ViewEncapsulation,
} from '@angular/core';
import { faCircle } from '@fortawesome/pro-solid-svg-icons';
import { Store } from '@ngxs/store';
import { ROLES_TYPE } from '@wbs/shared/models';

@Component({
  selector: 'wbs-project-role',
  templateUrl: './project-role.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class ProjectRoleComponent {
  @Input() role: ROLES_TYPE | undefined;
  @Input() userId: string | undefined;

  readonly faCircle = faCircle;

  constructor(private readonly store: Store) {}
}
