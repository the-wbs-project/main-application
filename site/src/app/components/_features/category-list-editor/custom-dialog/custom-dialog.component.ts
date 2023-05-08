import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  templateUrl: './custom-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class CustomDialogComponent {
  readonly form = new FormGroup({
    title: new FormControl<string>('', [Validators.required]),
    description: new FormControl<string>('', [Validators.required]),
  });

  constructor(public readonly modal: NgbActiveModal) {}

  get controls() {
    return this.form.controls;
  }

  close() {
    //this.dialog.close([this.form.value.title, this.form.value.description]);
  }

  cancel() {
    //this.dialog.close();
  }
}
