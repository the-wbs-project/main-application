import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { ListItem } from '@wbs/core/models';

@Component({
  standalone: true,
  imports: [TranslateModule],
  selector: 'wbs-project-category-dropdown-item',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `@if (item(); as dataItem) {
    <div class="d-flex flex-flow-row w-100 lh-3">
      <div class="pd-t-10 pd-r-15 mn-ht-50">
        <img
          class="wd-30 hd-30"
          [src]="dataItem.icon"
          [alt]="dataItem.label | translate"
        />
      </div>
      <div class="flex-grow-1 pd-y-5">
        <span class="d-block tx-semibold pd-0">
          {{ dataItem.label | translate }}
        </span>
        <span class="tx-10 ">
          {{ dataItem.description! | translate }}
        </span>
      </div>
    </div>
    }`,
})
export class ProjectCategoryDropdownItemComponent {
  readonly item = input.required<ListItem>();
}
