import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Category } from '@wbs/core/models';

@Component({
  standalone: true,
  selector: 'wbs-project-category-description',
  template: `@if (category(); as cat) {
    <div class="d-flex flex-flow-row w-100 lh-3">
      <div class="pd-t-10 pd-r-15 mn-ht-50">
        <img class="wd-30 hd-30" [src]="cat.icon" [alt]="cat.label" />
      </div>
      <div class="flex-grow-1 pd-y-5">
        <span class="d-block tx-semibold pd-0">
          {{ cat.label }}
        </span>
        <span class="tx-10">
          {{ cat.description }}
        </span>
      </div>
    </div>
    }`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectCategoryDescriptionComponent {
  readonly category = input.required<Category | undefined>();
}
