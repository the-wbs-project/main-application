import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
  ViewEncapsulation,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { Store } from '@ngxs/store';
import { MultiSelectModule } from '@progress/kendo-angular-dropdowns';
import { EditorModule } from '@progress/kendo-angular-editor';
import {
  CheckBoxModule,
  SwitchModule,
  TextBoxModule,
} from '@progress/kendo-angular-inputs';
import {
  LIBRARY_ENTRY_TYPES,
  LIBRARY_ENTRY_TYPES_TYPE,
} from '@wbs/core/models';
import { MetadataStore } from '@wbs/core/store';
import { LibraryEntryModalModel, LibraryEntryModalResults } from '../../models';
import { LibraryEntryDescriptionHintPipe } from './pipes/library-entry-description-hint.pipe';
import { LibraryEntryTitleHintPipe } from './pipes/library-entry-title-hint.pipe';

@Component({
  standalone: true,
  templateUrl: './library-entry-modal.component.html',
  styleUrl: './library-entry-modal.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [
    CheckBoxModule,
    EditorModule,
    LibraryEntryDescriptionHintPipe,
    LibraryEntryTitleHintPipe,
    MultiSelectModule,
    ReactiveFormsModule,
    SwitchModule,
    TextBoxModule,
    TranslateModule,
  ],
})
export class LibraryEntryModalComponent {
  readonly categories = inject(MetadataStore).categories.projectCategories;
  readonly contentCss = `.k-content { font-family: "Poppins", sans-serif; }`;
  readonly more = signal<boolean>(false);
  readonly form = new FormGroup({
    title: new FormControl<string>('', [Validators.required]),
    description: new FormControl<string>(''),
    includeResources: new FormControl(true),
    visibility: new FormControl(true),
    anyCategory: new FormControl(false),
    categories: new FormControl<string[]>([]),
  });

  type?: LIBRARY_ENTRY_TYPES_TYPE;

  constructor(readonly modal: NgbActiveModal, private readonly store: Store) {}

  setup(data: LibraryEntryModalModel): void {
    this.type = data.type;

    this.form.setValue({
      description: data.description ?? '',
      title: data.title,
      includeResources: true,
      visibility: true,
      anyCategory: false,
      categories: data.categories ?? [],
    });

    this.form.get('categories')?.clearValidators();

    if (data.type === LIBRARY_ENTRY_TYPES.PROJECT) {
      //this.form.get('categories')?.addValidators(Validators.required);
    }
  }

  clearCategories(clear: boolean): void {
    if (!clear) return;

    this.form.controls.categories.setValue(null);
  }

  save(nav: boolean): void {
    const form = this.form.getRawValue();
    const model: LibraryEntryModalResults = {
      type: this.type!,
      title: form.title!,
      description: form.description ?? undefined,
      includeResources: form.includeResources!,
      categories:
        form.anyCategory || (form.categories ?? []).length === 0
          ? undefined
          : form.categories!,
      nav,
      visibility: form.visibility ? 'public' : 'private',
    };
    this.modal.close(model);
  }
}
