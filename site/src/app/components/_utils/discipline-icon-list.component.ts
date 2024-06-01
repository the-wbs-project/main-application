import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { CategoryViewModel } from '@wbs/core/view-models';
import { DisciplineIconComponent } from './discipline-icon.component';

@Component({
  standalone: true,
  selector: 'wbs-discipline-icon-list',
  template: `@for (item of items(); track item.id) {
    <wbs-discipline-icon [item]="item" />
    }`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DisciplineIconComponent],
})
export class DisciplineIconListComponent {
  readonly items = input.required<CategoryViewModel[]>();
}
