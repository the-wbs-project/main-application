import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
} from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { ProjectCategory } from '@wbs/core/models';
import { UiStore } from '@wbs/store';
import { DisciplineListComponent } from './discipline-list.component';

@Component({
  standalone: true,
  selector: 'wbs-discipline-split-list',
  template: `@if (list2()) {
    <div class="d-flex w-100">
      <div class="flex-grow-1">
        <wbs-discipline-list
          [fullList]="fullList()"
          [selectedList]="list1()"
          [altClass]="altClass()"
          [itemClass]="itemClass()"
        />
      </div>
      <div class="flex-grow-1">
        <wbs-discipline-list
          [fullList]="fullList()"
          [selectedList]="list2()!"
          [altClass]="altClass()"
          [itemClass]="itemClass()"
        />
      </div>
    </div>
    } @else {
    <wbs-discipline-list
      [fullList]="fullList()"
      [selectedList]="selectedList()"
      [altClass]="altClass()"
      [itemClass]="itemClass()"
    />
    }`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DisciplineListComponent, TranslateModule],
})
export class DisciplineSplitListComponent {
  readonly width = inject(UiStore).mainContentWidth;

  readonly selectedList = input.required<ProjectCategory[]>();
  readonly fullList = input.required<ProjectCategory[]>();
  readonly splitLimit = input.required<number>();
  readonly altClass = input<string>();
  readonly itemClass = input<string>();

  readonly list1 = computed(() => {
    const list = this.selectedList();

    return list.length <= 5 ? list : list.slice(0, Math.ceil(list.length / 2));
  });
  readonly list2 = computed(() => {
    if (this.width()! < this.splitLimit()) return undefined;

    const list = this.selectedList();
    const count = Math.floor(list.length / 2);

    return list.length <= 5
      ? undefined
      : list.slice(list.length - count, list.length);
  });
}
