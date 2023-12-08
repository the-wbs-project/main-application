import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Project } from '@wbs/core/models';
import { ProjectStatusTileIconComponent } from '../project-status-tile-icon/project-status-tile-icon.component';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  standalone: true,
  selector: 'wbs-project-status-tile',
  templateUrl: './project-status-tile.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ProjectStatusTileIconComponent, TranslateModule],
})
export class ProjectStatusTileComponent {
  @Input({ required: true }) approvalEnabled!: boolean;
  @Input({ required: true }) project!: Project;
}
