import { ChangeDetectionStrategy, Component, model } from '@angular/core';
import { AlertComponent } from '@wbs/components/_utils/alert.component';
import { ProjectCategoryListComponent } from '@wbs/components/project-category-list';

@Component({
  standalone: true,
  selector: 'wbs-category-view',
  template: `<div class="tx-12">
      <wbs-alert
        type="info"
        [dismissible]="false"
        message="LibraryCreate.CategoryHelp"
      />
    </div>
    <div class="w-100 flex-fill">
      <wbs-project-category-list [(category)]="category" />
    </div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AlertComponent, ProjectCategoryListComponent],
})
export class CategoryViewComponent {
  readonly category = model.required<string | undefined>();
}
