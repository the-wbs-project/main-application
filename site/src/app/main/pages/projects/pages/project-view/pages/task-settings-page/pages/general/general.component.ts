import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Store } from '@ngxs/store';
import { EditorModule } from '@progress/kendo-angular-editor';
import { TextBoxModule } from '@progress/kendo-angular-inputs';
import { ChangeTaskBasics } from '../../../../actions';
import { TasksState } from '../../../../states';

@UntilDestroy()
@Component({
  standalone: true,
  templateUrl: './general.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    EditorModule,
    FormsModule,
    ReactiveFormsModule,
    TextBoxModule,
    TranslateModule,
  ],
})
export class TaskSettingsGeneralComponent {
  readonly form = new FormGroup({
    title: new FormControl<string>('', [Validators.required]),
    description: new FormControl<string>(''),
  });
  readonly contentCss = `.k-content {
    font-family: "Poppins", sans-serif;
  }`;

  constructor(private readonly store: Store) {}

  ngOnInit(): void {
    this.store
      .select(TasksState.current)
      .pipe(untilDestroyed(this))
      .subscribe((t) =>
        this.form.setValue({
          description: t?.description ?? '',
          title: t?.title ?? '',
        })
      );
  }

  save(): void {
    if (!this.form.valid) return;

    const values = this.form.getRawValue();

    this.store.dispatch(
      new ChangeTaskBasics(values.title!, values.description!)
    );
  }
}
