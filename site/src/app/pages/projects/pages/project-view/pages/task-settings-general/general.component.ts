import {
  ChangeDetectionStrategy,
  Component,
  Signal,
  inject,
  input,
  signal,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { Store } from '@ngxs/store';
import { faCheck } from '@fortawesome/pro-solid-svg-icons';
import { EditorModule } from '@progress/kendo-angular-editor';
import { TextBoxModule } from '@progress/kendo-angular-inputs';
import { FadingMessageComponent } from '@wbs/components/_utils/fading-message.component';
import { SaveButtonComponent } from '@wbs/components/_utils/save-button.component';
import { DirtyComponent } from '@wbs/core/models';
import { SaveService } from '@wbs/core/services';
import { ChangeTaskBasics } from '../../actions';
import { TasksState } from '../../states';

@Component({
  standalone: true,
  templateUrl: './general.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    EditorModule,
    FadingMessageComponent,
    FormsModule,
    ReactiveFormsModule,
    SaveButtonComponent,
    TextBoxModule,
    TranslateModule,
  ],
})
export class GeneralComponent implements DirtyComponent {
  private readonly store = inject(Store);

  readonly contentCss = `.k-content { font-family: "Poppins", sans-serif; }`;
  readonly form = new FormGroup({
    title: new FormControl<string>('', [Validators.required]),
    description: new FormControl<string>(''),
  });
  readonly saveService = new SaveService();
  readonly taskId = input.required<string>();
  readonly checkIcon = faCheck;

  get isDirty(): Signal<boolean> {
    return signal(this.form.dirty);
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

    this.saveService
      .call(
        this.store.dispatch(
          new ChangeTaskBasics(
            this.taskId(),
            values.title!,
            values.description!
          )
        )
      )
      .subscribe(() => this.form.reset(values));
  }
}
