import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ProjectNavigationLink } from '../../models';

@Component({
  selector: 'wbs-project-navigation',
  templateUrl: './project-navigation.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectNavigationComponent {
  @Input({ required: true }) pageView!: string | null;
  @Input({ required: true }) links!: ProjectNavigationLink[];
}
