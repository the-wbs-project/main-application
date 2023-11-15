import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { CategoryIconPipe } from '@wbs/main/pipes/category-icon.pipe';
import { CategoryLabelPipe } from '@wbs/main/pipes/category-label.pipe';

@Component({
  standalone: true,
  selector: 'wbs-project-title',
  template: `<div class="d-flex">
    <div class="wd-50 tx-center">
      @if (category | categoryIcon; as url) {
      <img
        [title]="category | categoryLabel | translate"
        [src]="url"
        class="wd-30 h-auto"
      />
      }
    </div>
    <h4 class="w-100 pd-5 mg-b-0">{{ title }}</h4>
  </div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CategoryIconPipe, CategoryLabelPipe, TranslateModule],
})
export class ProjectTitleComponent {
  @Input() title?: string;
  @Input() category?: string;
}
