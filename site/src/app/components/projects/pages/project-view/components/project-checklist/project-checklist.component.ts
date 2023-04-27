import {
  ChangeDetectionStrategy,
  Component,
  Input,
  ViewEncapsulation,
} from '@angular/core';
import { faCircle } from '@fortawesome/pro-solid-svg-icons';
import { ROLES_TYPE } from '@wbs/core/models';

@Component({
  selector: 'wbs-project-checklist',
  templateUrl: './project-checklist.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class ProjectChecklistComponent {
  @Input() role: ROLES_TYPE | undefined;
  @Input() userId: string | undefined;

  readonly faCircle = faCircle;
}
