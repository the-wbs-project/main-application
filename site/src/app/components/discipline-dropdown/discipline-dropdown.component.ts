import { NgClass } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  OnChanges,
  SimpleChanges,
  computed,
  input,
  output,
  signal,
  viewChild,
} from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faCheck } from '@fortawesome/pro-solid-svg-icons';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonModule } from '@progress/kendo-angular-buttons';
import {
  MultiSelectComponent,
  MultiSelectModule,
} from '@progress/kendo-angular-dropdowns';
import { CategoryViewModel } from '@wbs/core/view-models';
import { DisciplineIconPipe } from '@wbs/pipes/discipline-icon.pipe';

@Component({
  standalone: true,
  selector: 'wbs-discipline-dropdown',
  templateUrl: './discipline-dropdown.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ButtonModule,
    DisciplineIconPipe,
    FontAwesomeModule,
    MultiSelectModule,
    NgClass,
    TranslateModule,
  ],
})
export class DisciplinesDropdownComponent implements OnChanges {
  readonly saveIcon = faCheck;
  readonly multiselect = viewChild<MultiSelectComponent>(MultiSelectComponent);
  readonly data = input.required<CategoryViewModel[]>();
  readonly values = input.required<CategoryViewModel[]>();
  readonly save = output<CategoryViewModel[]>();
  readonly ids = signal<string[]>([]);
  readonly showSave = computed(() => {
    const vals = this.values();
    const ids = this.ids();

    return vals.length !== ids.length || vals.some((v) => !ids.includes(v.id));
  });

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['values']) {
      this.ids.set(this.values().map((v) => v.id));
      this.multiselect()?.toggle(true);
    }
  }

  saveSelected(): void {
    const ids = this.ids();

    this.multiselect()?.toggle(false);
    this.save.emit(this.data().filter((d) => ids.includes(d.id)));
  }
}
