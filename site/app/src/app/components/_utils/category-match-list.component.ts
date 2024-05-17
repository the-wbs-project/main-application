import { NgStyle } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  model,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ComboBoxModule } from '@progress/kendo-angular-dropdowns';
import { ProjectCategory } from '@wbs/core/models';
import { MetadataStore } from '@wbs/core/store';

@Component({
  standalone: true,
  selector: 'wbs-category-match-list',
  template: `<kendo-combobox
    [data]="list()"
    size="small"
    valueField="id"
    textField="label"
    [(ngModel)]="value"
    [valuePrimitive]="true"
    [ngStyle]="{ 'max-width': '300px' }"
  />`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ComboBoxModule, FormsModule, NgStyle],
})
export class CategoryMatchListComponent {
  private readonly metadata = inject(MetadataStore);

  readonly categories = input.required<ProjectCategory[]>();
  readonly value = model.required<string | undefined>();
  readonly list = computed(() => {
    const disciplines = this.metadata.categories.disciplines;

    return this.categories().map((category) => {
      if (category.isCustom) return { id: category.id, label: category.label };

      const discipline = disciplines.find((d) => d.id === category.id);

      return { id: category.id, label: discipline?.label ?? 'Unknown' };
    });
  });
}
