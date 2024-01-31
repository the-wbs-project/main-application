import {
  ChangeDetectionStrategy,
  Component,
  input,
  signal,
} from '@angular/core';
import { ListItem } from '@wbs/core/models';
import { SignalStore } from '@wbs/core/services';
import { ProjectCategoryMultipleListComponent } from '@wbs/main/components/project-category-multiple-list';
import { WizardFooterComponent } from '@wbs/main/components/wizard-footer';
import { LIBRARY_ENTRY_CREATION_PAGES } from '../../models';
import { LibraryEntryCreateService } from '../../services';
import { LibraryCreateState } from '../../states';
import { ProjectCategoryListComponent } from '@wbs/main/components/project-category-list';

@Component({
  standalone: true,
  templateUrl: './categories.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ProjectCategoryListComponent,
    ProjectCategoryMultipleListComponent,
    WizardFooterComponent,
  ],
})
export class CategoriesComponent {
  readonly org = input.required<string>();
  readonly type = input.required<string>();
  readonly categories = input.required<ListItem[]>();
  readonly selected = this.store.selectSignalSnapshot(
    LibraryCreateState.categories
  );

  constructor(
    private readonly service: LibraryEntryCreateService,
    private readonly store: SignalStore
  ) {}

  back(): void {
    this.service.nav(this.org(), LIBRARY_ENTRY_CREATION_PAGES.BASICS);
  }

  continue(selected: string[] = this.selected()): void {
    this.service.setCategories(this.org(), this.type(), selected);
  }
}
