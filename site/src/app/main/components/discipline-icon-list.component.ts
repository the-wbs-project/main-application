import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { DisciplineIconComponent } from './discipline-icon.component';

@Component({
  standalone: true,
  selector: 'wbs-discipline-icon-list',
  template: `@for (id of disciplines(); track id) {
    <wbs-discipline-icon [id]="id" />
    }`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DisciplineIconComponent],
})
export class DisciplineIconListComponent {
  readonly disciplines = input.required<string[] | undefined>();
}
