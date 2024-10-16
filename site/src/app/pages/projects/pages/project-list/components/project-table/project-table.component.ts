import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { Project } from '@wbs/core/models';
import { DateTextPipe } from '@wbs/pipes/date-text.pipe';
import { ProjectCategoryLabelPipe } from '@wbs/pipes/project-category-label.pipe';
import { ProjectStatusPipe } from '@wbs/pipes/project-status.pipe';

@Component({
  standalone: true,
  selector: 'wbs-project-table',
  templateUrl: './project-table.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    DateTextPipe,
    ProjectCategoryLabelPipe,
    ProjectStatusPipe,
    RouterModule,
    TranslateModule,
  ],
})
export class ProjectTableomponent {
  readonly projects = input.required<Project[]>();
}
