import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Project } from '@wbs/core/models';
import { EditedDateTextPipe } from '@wbs/pipes/edited-date-text.pipe';
import { ProjectCategoryLabelPipe } from '@wbs/pipes/project-category-label.pipe';

@Component({
  standalone: true,
  selector: 'wbs-project-grid',
  templateUrl: './project-grid.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [EditedDateTextPipe, ProjectCategoryLabelPipe, RouterModule],
})
export class ProjectGridComponent {
  readonly projects = input.required<Project[]>();
}
