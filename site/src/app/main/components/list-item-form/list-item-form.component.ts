import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Output,
  input,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { TextBoxModule } from '@progress/kendo-angular-inputs';

@Component({
  standalone: true,
  selector: 'wbs-list-item-form',
  templateUrl: './list-item-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, TextBoxModule, TranslateModule],
})
export class ListItemFormComponent {
  @Output() readonly dismissed = new EventEmitter<void>();
  @Output() readonly closed = new EventEmitter<
    [string, string | undefined | null]
  >();

  readonly showDescription = input<boolean>(true);
  readonly form = new FormGroup({
    title: new FormControl<string>('', [Validators.required]),
    description: new FormControl<string>(''),
  });

  get controls() {
    return this.form.controls;
  }

  close(): void {
    const values = this.form.getRawValue();

    this.closed.emit([values.title!, values.description]);
  }
}
