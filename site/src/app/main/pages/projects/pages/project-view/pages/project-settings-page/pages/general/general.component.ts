import { ChangeDetectionStrategy, Component } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, FormsModule, Validators } from '@angular/forms';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Store } from '@ngxs/store';
import { MetadataState } from '@wbs/core/states';
import { ProjectState } from '../../../../states';
import { ChangeProjectBasics } from '../../../../actions';
import { TextBoxModule } from '@progress/kendo-angular-inputs';
import { TranslateModule } from '@ngx-translate/core';
import { EditorModule } from '@progress/kendo-angular-editor';
import { DropDownListModule } from '@progress/kendo-angular-dropdowns';

@UntilDestroy()
@Component({
  standalone: true,
  templateUrl: './general.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DropDownListModule, EditorModule, FormsModule, TextBoxModule, TranslateModule]
})
export class ProjectSettingsGeneralComponent {
  readonly categories = toSignal(
    this.store.select(MetadataState.projectCategories)
  );
  readonly form = new FormGroup({
    title: new FormControl<string>('', [Validators.required]),
    description: new FormControl<string>(''),
    category: new FormControl<string>('', [Validators.required]),
  });

  constructor(private readonly store: Store) {}

  ngOnInit(): void {
    this.store
      .select(ProjectState.current)
      .pipe(untilDestroyed(this))
      .subscribe((p) => {
        this.form.setValue({
          category: p?.category ?? '',
          description: p?.description ?? '',
          title: p?.title ?? '',
        });
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
  }
}
