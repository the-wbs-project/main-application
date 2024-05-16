import {
  ChangeDetectionStrategy,
  Component,
  model,
  output,
} from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { LibraryCreateButtonComponent } from '../create-button';
import { LibraryItemTypeSelectorComponent } from '../item-type-selector';
import { LibrarySearchComponent } from '../search.component';
import { LibrarySelectorComponent } from '../selector';

@Component({
  standalone: true,
  selector: 'wbs-library-list-filters',
  templateUrl: './library-list-filters.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    LibraryCreateButtonComponent,
    LibraryItemTypeSelectorComponent,
    LibrarySearchComponent,
    LibrarySelectorComponent,
    TranslateModule,
  ],
})
export class LibraryListFiltersComponent {
  readonly searchText = model.required<string>();
  readonly typeFilters = model.required<string[]>();
  readonly library = model.required<string>();
  readonly showCreateButton = model.required<boolean>();
  readonly createClicked = output<string>();
}
