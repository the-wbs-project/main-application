import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { FormFieldModule, TextBoxModule } from '@progress/kendo-angular-inputs';

@Component({
  standalone: true,
  templateUrl: './custom-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [
    CommonModule,
    FormFieldModule,
    FormsModule,
    ReactiveFormsModule,
    TextBoxModule,
    TranslateModule,
  ],
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
