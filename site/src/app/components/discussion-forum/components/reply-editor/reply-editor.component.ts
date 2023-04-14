import { Component, Input } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngxs/store';
import { CreateReply } from '@wbs/core/actions';

@Component({
  selector: 'app-forum-reply-editor',
  templateUrl: './reply-editor.component.html',
})
export class ReplyEditorComponent {
  @Input() header?: string;
  @Input() replyToId?: string;

  readonly form = new FormGroup({
    message: new FormControl<string>('', [
      Validators.required,
      noWhitespaceValidator,
    ]),
  });

  constructor(private readonly store: Store) {}

  protected submit(): void {
    const values = this.form.getRawValue();

    if (this.replyToId && values.message) {
      this.store.dispatch(new CreateReply(this.replyToId, values.message));
    }
  }
}

function noWhitespaceValidator(control: FormControl) {
  const isWhitespace = (control.value || '').trim().length === 0;
  const isValid = !isWhitespace;
  return isValid ? null : { whitespace: true };
}
