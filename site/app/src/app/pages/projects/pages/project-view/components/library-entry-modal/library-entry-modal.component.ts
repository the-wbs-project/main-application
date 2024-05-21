import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonModule } from '@progress/kendo-angular-buttons';
import {
  DialogCloseResult,
  DialogContentBase,
  DialogModule,
  DialogRef,
  DialogService,
} from '@progress/kendo-angular-dialog';
import { EditorModule } from '@progress/kendo-angular-editor';
import { SwitchModule, TextBoxModule } from '@progress/kendo-angular-inputs';
import { LIBRARY_ENTRY_TYPES_TYPE } from '@wbs/core/models';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { LibraryEntryModalModel, LibraryEntryModalResults } from '../../models';
import {
  LibraryEntryDescriptionHintPipe,
  LibraryEntryTitleHintPipe,
} from './pipes';

@Component({
  standalone: true,
  templateUrl: './library-entry-modal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ButtonModule,
    DialogModule,
    EditorModule,
    LibraryEntryDescriptionHintPipe,
    LibraryEntryTitleHintPipe,
    ReactiveFormsModule,
    SwitchModule,
    TextBoxModule,
    TranslateModule,
  ],
})
export class LibraryEntryModalComponent extends DialogContentBase {
  readonly contentCss = `.k-content { font-family: "Poppins", sans-serif; }`;
  readonly more = signal<boolean>(false);
  readonly form = new FormGroup({
    title: new FormControl<string>('', [Validators.required]),
    description: new FormControl<string>(''),
    includeResources: new FormControl(true),
    visibility: new FormControl(true),
    anyCategory: new FormControl(false),
  });

  type?: LIBRARY_ENTRY_TYPES_TYPE;

  constructor(x: DialogRef) {
    super(x);
  }

  static launchAsync(
    dialog: DialogService,
    data: LibraryEntryModalModel
  ): Observable<any | undefined> {
    const ref = dialog.open({
      content: LibraryEntryModalComponent,
    });
    const comp = ref.content.instance as LibraryEntryModalComponent;
    comp.type = data.type;

    comp.form.setValue({
      description: data.description ?? '',
      title: data.title,
      includeResources: true,
      visibility: true,
      anyCategory: false,
    });

    comp.form.get('categories')?.clearValidators();

    return ref.result;
  }

  save(nav: boolean): void {
    const form = this.form.getRawValue();
    const model: LibraryEntryModalResults = {
      type: this.type!,
      title: form.title!,
      description: form.description ?? undefined,
      includeResources: form.includeResources!,
      nav,
      visibility: form.visibility ? 'public' : 'private',
    };
    this.dialog.close(model);
  }
}
