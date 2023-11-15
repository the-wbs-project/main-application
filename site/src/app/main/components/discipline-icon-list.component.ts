import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { DisciplineIconComponent } from './discipline-icon.component';

@Component({
  standalone: true,
  selector: 'wbs-discipline-icon-list',
  template: `@for (id of disciplines ?? []; track id) {
    <wbs-discipline-icon [id]="id" />
    }`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DisciplineIconComponent],
})
export class DisciplineIconListComponent {
  @Input() disciplines: string[] | undefined;
}
