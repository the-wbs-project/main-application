import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faCircle,
  faCircleCheck,
  faCircleXmark,
} from '@fortawesome/pro-solid-svg-icons';

@Component({
  standalone: true,
  selector: 'wbs-project-status-tile-icon',
  templateUrl: './project-status-tile-icon.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FontAwesomeModule, NgClass],
})
export class ProjectStatusTileIconComponent {
  @Input({ required: true }) status!:
    | 'unstarted'
    | 'in-progress'
    | 'completed'
    | 'rejected';

  faCircle = faCircle;
  faCircleCheck = faCircleCheck;
  faCircleXmark = faCircleXmark;
}
