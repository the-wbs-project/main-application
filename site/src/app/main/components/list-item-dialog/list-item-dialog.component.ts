import {
  ChangeDetectionStrategy,
  Component,
  Input,
  ViewEncapsulation,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { TextBoxModule } from '@progress/kendo-angular-inputs';

@Component({
  standalone: true,
  templateUrl: './list-item-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [ReactiveFormsModule, TextBoxModule, TranslateModule],
})
export class ListItemDialogComponent {
  @Input() showDescription = true;

  readonly form = new FormGroup({
    title: new FormControl<string>('', [Validators.required]),
    description: new FormControl<string>(''),
  });

  constructor(public readonly modal: NgbActiveModal) {}

  get controls() {
    return this.form.controls;
  }

  setup({ showDescription }: { showDescription: boolean }): void {
    this.showDescription = showDescription;
  }

  close(): void {
    const values = this.form.getRawValue();

    this.modal.close([values.title, values.description]);
  }
}
