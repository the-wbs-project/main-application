import { NgStyle } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ComboBoxModule } from '@progress/kendo-angular-dropdowns';

@Component({
  standalone: true,
  selector: 'wbs-phase-match-list',
  template: `<kendo-combobox
    [data]="phases"
    size="small"
    textField="label"
    valueField="id"
    [valuePrimitive]="true"
    [(ngModel)]="category.sameAs"
    [ngStyle]="{ 'max-width': '300px' }"
  />`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ComboBoxModule, FormsModule, NgStyle],
})
export class PhaseMatchListComponent {
  @Input({ required: true }) phases!: { id: string; label: string }[];
  @Input({ required: true }) category!: { sameAs?: string };
}
