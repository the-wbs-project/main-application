import {
  ChangeDetectionStrategy,
  Component,
  Input,
  ViewEncapsulation,
} from '@angular/core';
import { faCircle, faFaceSmile } from '@fortawesome/pro-solid-svg-icons';
import { UserRolesViewModel } from '../../view-models';

@Component({
  selector: 'wbs-project-role',
  templateUrl: './project-role.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class ProjectRoleComponent {
  @Input({ required: true }) user?: UserRolesViewModel;

  readonly faCircle = faCircle;
  readonly faFaceSmile = faFaceSmile;
}
