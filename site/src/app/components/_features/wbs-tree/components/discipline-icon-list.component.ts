import { Component, Input } from '@angular/core';

@Component({
  selector: 'wbs-discipline-icon-list',
  template: ` <ng-template ngFor let-id [ngForOf]="disciplines ?? []">
    <wbs-discipline-icon [id]="id"> </wbs-discipline-icon>
  </ng-template>`,
  preserveWhitespaces: false,
})
export class DisciplineIconListComponent {
  @Input() disciplines: string[] | undefined;
}