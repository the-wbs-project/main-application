import { NgFor } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { DisciplineIconComponent } from './discipline-icon.component';

@Component({
  standalone: true,
  selector: 'wbs-discipline-icon-list',
  template: `<ng-template ngFor let-id [ngForOf]="disciplines ?? []">
    <wbs-discipline-icon [id]="id" />
  </ng-template>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DisciplineIconComponent, NgFor],
})
export class DisciplineIconListComponent {
  @Input() disciplines: string[] | undefined;
}
