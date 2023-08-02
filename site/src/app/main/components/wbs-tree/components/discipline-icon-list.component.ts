import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { DisciplineIconComponent } from './discipline-icon.component';

@Component({
  standalone: true,
  selector: 'wbs-discipline-icon-list',
  template: `<ng-template ngFor let-id [ngForOf]="disciplines ?? []">
    <wbs-discipline-icon [id]="id"> </wbs-discipline-icon>
  </ng-template>`,
  imports: [CommonModule, DisciplineIconComponent],
})
export class DisciplineIconListComponent {
  @Input() disciplines: string[] | undefined;
}