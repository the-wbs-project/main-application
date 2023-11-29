import { NgStyle } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ComboBoxModule } from '@progress/kendo-angular-dropdowns';

@Component({
  standalone: true,
  selector: 'wbs-category-match-list',
  template: `<kendo-combobox
    [data]="categories"
    size="small"
    textField="label"
    valueField="id"
    [valuePrimitive]="true"
    [(ngModel)]="value"
    [ngStyle]="{ 'max-width': '300px' }"
    (valueChange)="valueChange.emit($event)"
  />`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ComboBoxModule, FormsModule, NgStyle],
})
export class CategoryMatchListComponent {
  @Input({ required: true }) categories!: { id: string; label: string }[];
  @Input({ required: true }) value?: string;
  @Output() readonly valueChange = new EventEmitter<string>();
}
