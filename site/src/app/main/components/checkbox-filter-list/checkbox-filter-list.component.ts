import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { MultiSelectModule } from '@progress/kendo-angular-dropdowns';
import { TranslateListPipe } from '@wbs/main/pipes/translate-list.pipe';

@Component({
  standalone: true,
  selector: 'wbs-checkbox-filter-list',
  templateUrl: './checkbox-filter-list.component.html',
  styleUrls: ['./checkbox-filter-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MultiSelectModule, TranslateListPipe, TranslateModule],
})
export class CheckboxFilterListComponent {
  readonly data = input.required<any[]>();
  readonly values = input.required<string[]>();
  readonly textField = input.required<string>();
  readonly valueField = input.required<string>();
  readonly allLabel = input.required<string>();
  readonly labelWidth = input.required<number>();
  readonly valuesChange = output<string[]>();

  onlyClicked(e: Event, item: any): void {
    e.stopPropagation();

    this.set([item[this.valueField()]]);
  }

  valueChange(value: string[]): void {
    this.set(value.includes('all') ? ['all'] : value);
  }

  private set(values: string[]): void {
    this.valuesChange.emit(values);
  }
}
