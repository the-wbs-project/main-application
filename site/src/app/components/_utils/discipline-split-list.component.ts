import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
} from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { UiStore } from '@wbs/core/store';
import { CategoryViewModel } from '@wbs/core/view-models';
import { DisciplineListComponent } from './discipline-list.component';

@Component({
  standalone: true,
  selector: 'wbs-discipline-split-list',
  template: `@if (list2()) {
    <div class="d-flex w-100">
      <div class="flex-grow-1">
        <wbs-discipline-list
          [items]="list1()"
          [altClass]="altClass()"
          [itemClass]="itemClass()"
        />
      </div>
      <div class="flex-grow-1">
        <wbs-discipline-list
          [items]="list2()!"
          [altClass]="altClass()"
          [itemClass]="itemClass()"
        />
      </div>
    </div>
    } @else {
    <wbs-discipline-list
      [items]="items()"
      [altClass]="altClass()"
      [itemClass]="itemClass()"
    />
    }`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DisciplineListComponent, TranslateModule],
})
export class DisciplineSplitListComponent {
  readonly width = inject(UiStore).mainContentWidth;

  readonly items = input.required<CategoryViewModel[]>();
  readonly splitLimit = input.required<number>();
  readonly altClass = input<string>();
  readonly itemClass = input<string>();

  readonly list1 = computed(() => {
    const list = this.items();

    return list.length <= 5 ? list : list.slice(0, Math.ceil(list.length / 2));
  });
  readonly list2 = computed(() => {
    if (this.width()! < this.splitLimit()) return undefined;

    const list = this.items();
    const count = Math.floor(list.length / 2);

    return list.length <= 5
      ? undefined
      : list.slice(list.length - count, list.length);
  });
}
