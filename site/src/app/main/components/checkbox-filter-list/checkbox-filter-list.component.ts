import { NgIf } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
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
  imports: [MultiSelectModule, NgIf, TranslateListPipe, TranslateModule],
})
export class CheckboxFilterListComponent {
  @Input({ required: true }) data!: any[];
  @Input({ required: true }) values!: string[];
  @Input({ required: true }) textField!: string;
  @Input({ required: true }) valueField!: string;
  @Input({ required: true }) allLabel!: string;
  @Input({ required: true }) labelWidth!: number;
  @Output() readonly valuesChange = new EventEmitter<string[]>();

  onlyClicked(e: Event, item: any): void {
    e.stopPropagation();

    this.set([item[this.valueField]]);
  }

  valueChange(value: string[]): void {
    this.set(value.includes('all') ? ['all'] : value);
  }

  private set(values: string[]): void {
    this.values = values;
    this.valuesChange.emit(values);
  }
}
