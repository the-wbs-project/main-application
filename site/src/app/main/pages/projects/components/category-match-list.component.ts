import { NgStyle } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  input,
  model,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ComboBoxModule } from '@progress/kendo-angular-dropdowns';

@Component({
  standalone: true,
  selector: 'wbs-category-match-list',
  template: `<kendo-combobox
    [data]="categories()"
    size="small"
    textField="label"
    valueField="id"
    [valuePrimitive]="true"
    [(ngModel)]="value"
    [ngStyle]="{ 'max-width': '300px' }"
  />`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ComboBoxModule, FormsModule, NgStyle],
})
export class CategoryMatchListComponent {
  readonly categories = input.required<{ id: string; label: string }[]>();
  readonly value = model.required<string | undefined>();
}
