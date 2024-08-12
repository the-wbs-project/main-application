import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { TranslateModule } from '@ngx-translate/core';
import {
  ButtonGroupModule,
  ButtonModule,
} from '@progress/kendo-angular-buttons';

@Component({
  standalone: true,
  selector: 'wbs-library-filter',
  template: `<kendo-buttongroup [selection]="selectionMode()">
    @for (button of buttons(); track $index) {
    <button
      kendoButton
      size="small"
      [selected]="
        selection() === button.value ||
        (selection() ?? []).includes(button.value)
      "
      (click)="selectionChanged.emit(button.value)"
    >
      @if (button.icon) {
      <fa-icon [icon]="button.icon" class="mg-r-5" />
      } {{ button.label | translate }}
    </button>
    }
  </kendo-buttongroup>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ButtonGroupModule,
    ButtonModule,
    FontAwesomeModule,
    TranslateModule,
  ],
})
export class LibraryFilterComponent {
  readonly buttons =
    input.required<{ value: string; label: string; icon?: IconDefinition }[]>();
  readonly selection = input.required<string | string[] | undefined>();
  readonly selectionMode = input<'single' | 'multiple'>('single');
  readonly selectionChanged = output<string>();
}
