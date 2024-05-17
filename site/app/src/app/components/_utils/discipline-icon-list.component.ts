import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { ProjectCategory } from '@wbs/core/models';
import { DisciplineIconComponent } from './discipline-icon.component';

@Component({
  standalone: true,
  selector: 'wbs-discipline-icon-list',
  template: `@for (cat of disciplines(); track $index) {
    <wbs-discipline-icon [cat]="cat" [fullList]="fullList()" />
    }`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DisciplineIconComponent],
})
export class DisciplineIconListComponent {
  readonly disciplines = input.required<ProjectCategory[] | string[]>();
  readonly fullList = input<ProjectCategory[]>();
}
