import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { UntilDestroy } from '@ngneat/until-destroy';
import { DialogRef } from '@progress/kendo-angular-dialog';
import { BehaviorSubject } from 'rxjs';

@UntilDestroy()
@Component({
  templateUrl: './custom-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class CustomDialog2Component {
  readonly dialogTitle$ = new BehaviorSubject<string>('');
  readonly form = new FormGroup({
    title: new FormControl<string>('', [Validators.required]),
    description: new FormControl<string>('', [Validators.required]),
  });

  constructor(private readonly dialog: DialogRef) {
    //  this.dialog.
  }

  get controls() {
    return this.form.controls;
  }

  setTitle(title: string) {
    this.dialogTitle$.next(title);
  }

  close() {
    this.dialog.close([this.form.value.title, this.form.value.description]);
  }

  cancel() {
    this.dialog.close();
  }
}
