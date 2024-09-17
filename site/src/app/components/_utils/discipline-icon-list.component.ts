import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';
import { CategoryViewModel } from '@wbs/core/view-models';
import { DisciplineIconComponent } from './discipline-icon.component';
import { ChipModule } from '@progress/kendo-angular-buttons';
import { PopoverModule } from '@progress/kendo-angular-tooltip';
import { DisciplineListComponent } from './discipline-list.component';

@Component({
  standalone: true,
  selector: 'wbs-discipline-icon-list',
  template: `@for (item of iconList(); track item.id) {
    <span class="d-inline-block" [style.width.px]="spanWidth()">
      <wbs-discipline-icon [item]="item" />
    </span>
    } @if (showChip()) {
    <a kendoPopoverAnchor [popover]="myPopover" showOn="hover">
      <span class="badge rounded-pill bg-dark tx-10 mg-l-5 pointer">
        +{{ chipCount() }}
      </span>
    </a>

    <kendo-popover #myPopover position="left" [width]="200">
      <ng-template kendoPopoverBodyTemplate>
        <div class="w-100 pd-5">
          <wbs-discipline-list
            altClass="bg-gray-200"
            itemClass="tx-11"
            [items]="popoverContent()"
          />
        </div>
      </ng-template>
    </kendo-popover>
    } `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ChipModule,
    DisciplineIconComponent,
    DisciplineListComponent,
    PopoverModule,
  ],
})
export class DisciplineIconListComponent {
  readonly spanWidth = input(20);
  readonly items = input.required<CategoryViewModel[]>();
  readonly limit = input(8);
  readonly iconList = computed(() => {
    const items = this.items();
    const limit = this.limit();

    return items.length > limit ? items.slice(0, limit - 2) : items;
  });
  readonly showChip = computed(() => this.items().length > this.limit());
  readonly chipCount = computed(() => {
    const items = this.items();
    const limit = this.limit() - 2;

    return items.length > limit ? items.length - limit : 0;
  });
  readonly popoverContent = computed(() => {
    const items = this.items();
    const limit = this.limit() - 2;

    return items.length > limit ? items.slice(limit) : [];
  });
}
