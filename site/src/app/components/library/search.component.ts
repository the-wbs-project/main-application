import { ChangeDetectionStrategy, Component, model } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { TextBoxModule } from '@progress/kendo-angular-inputs';
import { DelayedInputDirective } from '@wbs/core/directives/delayed-input.directive';

@Component({
  standalone: true,
  selector: 'wbs-library-search',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DelayedInputDirective, TextBoxModule, TranslateModule],
  template: `<input
    kendoTextBox
    appDelayedInput
    type="text"
    class="form-control w-100"
    [value]="searchText()!"
    [placeholder]="'Wbs.SearchLibrary' | translate"
    (delayedInput)="searchText.set($event)"
    [delayTime]="400"
  />`,
})
export class LibrarySearchComponent {
  readonly searchText = model.required<string>();
}
