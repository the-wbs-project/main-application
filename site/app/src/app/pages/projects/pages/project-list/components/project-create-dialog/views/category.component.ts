import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { AlertComponent } from '@wbs/components/_utils/alert.component';
import { ProjectCategoryListComponent } from '@wbs/components/project-category-list';
import { ProjectCreateStore } from '../project-create.store';

@Component({
  standalone: true,
  selector: 'wbs-project-create-category',
  template: `<div class="tx-12">
      <wbs-alert
        type="info"
        [dismissible]="false"
        message="ProjectCreate.Category_Description"
      />
    </div>
    <div class="w-100 flex-fill">
      <wbs-project-category-list [(category)]="category" />
    </div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AlertComponent, ProjectCategoryListComponent],
})
export class ProjectCreateCategoryComponent {
  readonly category = inject(ProjectCreateStore).category;
}
