import { ChangeDetectionStrategy, Component, model } from '@angular/core';
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
  template: `<kendo-buttongroup selection="single">
    @for (button of buttons(); track $index) {
    <button
      kendoButton
      size="small"
      [selected]="selection() === button.value"
      (click)="selection.set(button.value)"
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
    model.required<{ value: string; label: string; icon?: IconDefinition }[]>();
  readonly selection = model.required<string | undefined>();
}
