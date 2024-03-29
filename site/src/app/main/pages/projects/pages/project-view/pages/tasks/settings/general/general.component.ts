import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { Store } from '@ngxs/store';
import { EditorModule } from '@progress/kendo-angular-editor';
import { TextBoxModule } from '@progress/kendo-angular-inputs';
import { DirtyComponent } from '@wbs/main/models';
import { ChangeTaskBasics } from '../../../../actions';
import { TasksState } from '../../../../states';

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
export class TaskSettingsGeneralComponent implements DirtyComponent {
  readonly contentCss = `.k-content { font-family: "Poppins", sans-serif; }`;
  readonly form = new FormGroup({
    title: new FormControl<string>('', [Validators.required]),
    description: new FormControl<string>(''),
  });

  constructor(private readonly store: Store) {}

  get isDirty(): boolean {
    return this.form.dirty;
  }

  ngOnInit(): void {
    const t = this.store.selectSnapshot(TasksState.current);

    this.form.setValue({
      description: t?.description ?? '',
      title: t?.title ?? '',
    });
  }

  save(): void {
    if (!this.form.valid) return;

    const values = this.form.getRawValue();

    this.store.dispatch(
      new ChangeTaskBasics(values.title!, values.description!)
    );
    this.form.reset(values);
  }
}
