import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  Validators,
} from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { Store } from '@ngxs/store';
import { DropDownListModule } from '@progress/kendo-angular-dropdowns';
import { EditorModule } from '@progress/kendo-angular-editor';
import { TextBoxModule } from '@progress/kendo-angular-inputs';
import { ListItem } from '@wbs/core/models';
import { DirtyComponent } from '@wbs/main/models';
import { ChangeProjectBasics } from '../../../../../actions';
import { ProjectState } from '../../../../../states';

@Component({
  standalone: true,
  templateUrl: './general.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    DropDownListModule,
    EditorModule,
    FormsModule,
    TextBoxModule,
    TranslateModule,
  ],
})
export class ProjectSettingsGeneralComponent implements DirtyComponent {
  @Input() readonly categories!: ListItem[];

  readonly form = new FormGroup({
    title: new FormControl<string>('', [Validators.required]),
    description: new FormControl<string>(''),
    category: new FormControl<string>('', [Validators.required]),
  });

  constructor(private readonly store: Store) {}

  get isDirty(): boolean {
    return this.form.dirty;
  }

  ngOnInit(): void {
    const p = this.store.selectSnapshot(ProjectState.current);

    this.form.setValue({
      category: p?.category ?? '',
      description: p?.description ?? '',
      title: p?.title ?? '',
    });
  }

  save(): void {
    if (!this.form.valid) return;

    const values = this.form.getRawValue();

    this.store.dispatch(
      new ChangeProjectBasics(
        values.title!,
        values.description!,
        values.category!
      )
    );
    this.form.reset(values);
  }
}
