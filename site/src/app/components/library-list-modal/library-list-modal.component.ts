import {
  ChangeDetectionStrategy,
  Component,
  model,
  signal,
} from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import {
  DialogCloseResult,
  DialogContentBase,
  DialogModule,
  DialogRef,
  DialogService,
} from '@progress/kendo-angular-dialog';
import { LibraryEntryViewModel } from '@wbs/core/view-models';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { LibraryListComponent } from '../library-list';
import { faPencil, faSearch, faStamp } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { StepperComponent } from '@wbs/dummy_components/stepper.component';
import { StepperItem } from '@wbs/core/models';
import { EntryLibraryChooserComponent } from '@wbs/dummy_components/entry-library-chooser/entry-library-chooser.component';
import { LibrarySearchComponent } from '../../dummy_components/library-search.component';
import { LibraryItemTypeSelectorComponent } from '@wbs/dummy_components/library-item-type-selector';
import { ButtonModule } from '@progress/kendo-angular-buttons';

@Component({
  standalone: true,
  templateUrl: './library-list-modal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ButtonModule,
    DialogModule,
    EntryLibraryChooserComponent,
    FontAwesomeModule,
    LibraryItemTypeSelectorComponent,
    LibraryListComponent,
    LibrarySearchComponent,
    StepperComponent,
    TranslateModule,
  ],
})
export class LibraryListModalComponent extends DialogContentBase {
  readonly org = signal<string | undefined>(undefined);
  readonly selected = model<LibraryEntryViewModel | undefined>(undefined);
  readonly view = signal(0);
  readonly ready = signal(false);
  readonly library = model<string>('personal');
  readonly searchText = model('');
  readonly typeFilters = model<string[]>([]);
  readonly steps: StepperItem[] = [
    { label: 'General.Search', icon: faSearch },
    { label: 'General.Review', icon: faStamp },
  ];

  constructor(dialog: DialogRef) {
    super(dialog);
  }

  static launchAsync(
    dialog: DialogService,
    org: string,
    library: string,
    typeFilters: string[] | undefined
  ): Observable<LibraryEntryViewModel | undefined> {
    const ref = dialog.open({
      content: LibraryListModalComponent,
    });
    const component = ref.content.instance as LibraryListModalComponent;

    component.org.set(org);
    component.library.set(library);
    component.typeFilters.set(typeFilters ?? []);
    component.ready.set(true);

    return ref.result.pipe(
      map((x: unknown) =>
        x instanceof DialogCloseResult ? undefined : <LibraryEntryViewModel>x
      )
    );
  }
}
