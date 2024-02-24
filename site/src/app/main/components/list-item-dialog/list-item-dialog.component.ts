import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import {
  DialogContentBase,
  DialogModule,
  DialogRef,
} from '@progress/kendo-angular-dialog';
import { TextBoxModule } from '@progress/kendo-angular-inputs';

@Component({
  standalone: true,
  templateUrl: './list-item-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DialogModule, ReactiveFormsModule, TextBoxModule, TranslateModule],
})
export class ListItemDialogComponent extends DialogContentBase {
  readonly showDescription = signal<boolean>(true);
  readonly form = new FormGroup({
    title: new FormControl<string>('', [Validators.required]),
    description: new FormControl<string>(''),
  });

  constructor(dialog: DialogRef) {
    super(dialog);
  }

  close(): void {
    const values = this.form.getRawValue();

    this.dialog.close([values.title, values.description]);
  }
}
