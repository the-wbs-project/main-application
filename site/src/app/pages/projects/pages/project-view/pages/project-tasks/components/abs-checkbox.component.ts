import { Component, input, model } from '@angular/core';
import { CheckBoxModule } from '@progress/kendo-angular-inputs';

@Component({
  standalone: true,
  selector: 'wbs-abs-checkbox',
  imports: [CheckBoxModule],
  template: `<input
    kendoCheckBox
    type="checkbox"
    [checked]="checked()"
    [class.bg-primary]="!checked() && implied()"
    (change)="checked.set(!checked())"
  />`,
})
export class AbsCheckboxComponent {
  readonly checked = model.required<boolean>();
  readonly implied = input.required<boolean>();
}
