import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { ProjectCategory } from '@wbs/core/models';
import { DisciplineIconComponent } from './discipline-icon.component';

@Component({
  standalone: true,
  selector: 'wbs-discipline-icon-list',
  template: `@for (id of disciplines(); track id) {
    <wbs-discipline-icon [id]="id" [fullList]="fullList()" />
    }`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DisciplineIconComponent],
})
export class DisciplineIconListComponent {
  readonly disciplines = input.required<string[] | undefined>();
  readonly fullList = input<ProjectCategory[]>();
}
