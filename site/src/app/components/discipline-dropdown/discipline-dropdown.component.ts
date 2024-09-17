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
import { faCheck, faXmark } from '@fortawesome/pro-solid-svg-icons';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonModule } from '@progress/kendo-angular-buttons';
import {
  MultiSelectComponent,
  MultiSelectModule,
} from '@progress/kendo-angular-dropdowns';
import { SaveState } from '@wbs/core/models';
import { CategoryViewModel } from '@wbs/core/view-models';
import { DisciplineIconPipe } from '@wbs/pipes/discipline-icon.pipe';
import { SaveMessageComponent } from '../_utils/save-message.component';

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
    SaveMessageComponent,
    TranslateModule,
  ],
})
export class DisciplinesDropdownComponent implements OnChanges {
  readonly multiselect = viewChild<MultiSelectComponent>(MultiSelectComponent);
  readonly cancelIcon = faXmark;
  //
  //  Inputs
  //
  readonly data = input.required<CategoryViewModel[]>();
  readonly values = input.required<CategoryViewModel[]>();
  readonly saveState = input<SaveState | undefined>();
  readonly saveIcon = input(faCheck);
  readonly autoSave = input(false);
  //
  //  Signals
  //
  readonly ids = signal<string[]>([]);
  readonly saving = computed(() => this.saveState() === 'saving');
  readonly showSave = computed(() => {
    const vals = this.values();
    const ids = this.ids();

    return vals.length !== ids.length || vals.some((v) => !ids.includes(v.id));
  });
  //
  //  Outputs
  //
  readonly save = output<CategoryViewModel[]>();
  readonly cancel = output<void>();

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

  valueChange(ids: string[]): void {
    if (this.autoSave()) {
      this.save.emit(this.data().filter((d) => ids.includes(d.id)));
    }
  }
}
