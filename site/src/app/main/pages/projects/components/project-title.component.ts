import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { ProjectCategoryIconPipe } from '@wbs/main/pipes/project-category-icon.pipe';
import { ProjectCategoryLabelPipe } from '@wbs/main/pipes/project-category-label.pipe';

@Component({
  standalone: true,
  selector: 'wbs-project-title',
  template: `<div class="d-flex">
    <div class="wd-50 tx-center">
      @if (category | projectCategoryIcon; as url) {
      <img
        [src]="url"
        [title]="category | projectCategoryLabel | translate"
        class="wd-30 h-auto"
      />
      }
    </div>
    <h4 class="w-100 pd-5 mg-b-0">{{ title }}</h4>
  </div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ProjectCategoryIconPipe, ProjectCategoryLabelPipe, TranslateModule],
})
export class ProjectTitleComponent {
  @Input() title?: string;
  @Input() category?: string;
}
