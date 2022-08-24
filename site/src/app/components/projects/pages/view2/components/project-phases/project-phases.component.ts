import {
  ChangeDetectionStrategy,
  Component,
  Input,
  ViewEncapsulation,
} from '@angular/core';
import { faCircle } from '@fortawesome/pro-solid-svg-icons';
import { UserRole } from '../../models';

@Component({
  selector: 'wbs-project-phases',
  templateUrl: './project-phases.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class ProjectPhasesComponent {
  @Input() roles?: UserRole[] | null;

  readonly faCircle = faCircle;
}
