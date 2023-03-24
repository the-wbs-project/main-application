import { Component, Input } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Navigate } from '@ngxs/router-plugin';
import { Store } from '@ngxs/store';
import { CreateThread } from '@wbs/core/actions';

@Component({
  selector: 'app-forum-editor',
  templateUrl: './editor.component.html',
  //styleUrls: ['./editor.component.css'],
})
export class EditorComponent {
  @Input() header?: string;

  readonly form = new FormGroup({
    title: new FormControl<string>('', [
      Validators.required,
      noWhitespaceValidator,
    ]),
    message: new FormControl<string>('', [
      Validators.required,
      noWhitespaceValidator,
    ]),
  });

  constructor(private readonly store: Store) {}

  protected submit(): void {
    const values = this.form.getRawValue();

    if (values.title && values.message) {
      this.store
        .dispatch(new CreateThread(values.title, values.message))
        .subscribe(() => this.store.dispatch(new Navigate(['./'])));
    }
  }
}

function noWhitespaceValidator(control: FormControl) {
  const isWhitespace = (control.value || '').trim().length === 0;
  const isValid = !isWhitespace;
  return isValid ? null : { whitespace: true };
}
