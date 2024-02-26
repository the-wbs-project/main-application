import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { Project } from '@wbs/core/models';
import { ProjectStatusTileIconComponent } from '../project-status-tile-icon';

@Component({
  standalone: true,
  selector: 'wbs-project-status-tile',
  templateUrl: './project-status-tile.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ProjectStatusTileIconComponent, TranslateModule],
})
export class ProjectStatusTileComponent {
  readonly approvalEnabled = input.required<boolean>();
  readonly project = input.required<Project>();
}
