import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { CategoryViewModel } from '@wbs/core/view-models';

@Component({
  standalone: true,
  selector: 'wbs-discipline-list',
  template: `<ul class="list-group border-0">
    @for (item of items(); track item.id; let odd = $odd) {
    <li
      class="list-group-item pd-y-5 pd-x-0 border-0 bg-transparent"
      [ngClass]="[odd && altClass() ? altClass() : '', itemClass() ?? '']"
    >
      <span class="d-inline-block wd-20 text-center mg-r-10">
        <i class="fa-solid" [ngClass]="item.icon"></i>
      </span>
      {{ item.label }}
    </li>
    }
  </ul>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgClass],
})
export class DisciplineListComponent {
  readonly items = input.required<CategoryViewModel[]>();
  readonly altClass = input<string>();
  readonly itemClass = input<string>();
}
