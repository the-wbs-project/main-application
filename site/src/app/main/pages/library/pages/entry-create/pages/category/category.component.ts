import {
  ChangeDetectionStrategy,
  Component,
  input,
  signal,
} from '@angular/core';
import { Store } from '@ngxs/store';
import { ListItem } from '@wbs/core/models';
import { ProjectCategoryListComponent } from '@wbs/main/components/project-category-list';
import { WizardFooterComponent } from '@wbs/main/components/wizard-footer';
import { LIBRARY_ENTRY_CREATION_PAGES } from '../../models';
import { LibraryEntryCreateService } from '../../services';
import { LibraryCreateState } from '../../states';

@Component({
  standalone: true,
  templateUrl: './category.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ProjectCategoryListComponent, WizardFooterComponent],
})
export class CategoryComponent {
  readonly org = input.required<string>();
  readonly type = input.required<string>();
  readonly categories = input.required<ListItem[]>();
  readonly selected = signal<string | undefined>(
    this.store.selectSnapshot(LibraryCreateState.categories)[0]
  );

  constructor(
    private readonly service: LibraryEntryCreateService,
    private readonly store: Store
  ) {}

  back(): void {
    this.service.nav(this.org(), LIBRARY_ENTRY_CREATION_PAGES.GETTING_STARTED);
  }

  continue(category: string): void {
    this.service.setCategories(this.org(), this.type(), [category]);
  }
}
