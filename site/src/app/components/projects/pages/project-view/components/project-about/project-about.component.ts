import {
  ChangeDetectionStrategy,
  Component,
  Input,
  ViewEncapsulation,
} from '@angular/core';
import { faCircle } from '@fortawesome/pro-solid-svg-icons';
import { UserRole } from '@wbs/core/models';

@Component({
  selector: 'wbs-project-about',
  templateUrl: './project-about.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class ProjectAboutComponent {
  @Input() roles?: UserRole[] | null;

  readonly faCircle = faCircle;
}
