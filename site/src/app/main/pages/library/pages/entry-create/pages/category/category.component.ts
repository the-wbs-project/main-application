import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Store } from '@ngxs/store';
import { ListItem } from '@wbs/core/models';
import { ProjectCategoryListComponent } from '@wbs/main/components/project-category-list';
import { WizardFooterComponent } from '@wbs/main/components/wizard-footer';
import { CategoryChosen } from '../../actions';
import { LIBRARY_ENTRY_CREATION_PAGES } from '../../models';
import { LibraryEntryCreateService } from '../../services';

@Component({
  standalone: true,
  templateUrl: './category.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ProjectCategoryListComponent, WizardFooterComponent],
})
export class CategoryComponent {
  @Input() org!: string;
  @Input() type!: string;
  @Input() categories!: ListItem[];
  @Input() selected?: string;

  constructor(
    private readonly service: LibraryEntryCreateService,
    private readonly store: Store
  ) {}

  back(): void {
    this.service.nav(this.org, LIBRARY_ENTRY_CREATION_PAGES.GETTING_STARTED);
  }

  continue(category: string): void {
    this.store.dispatch(new CategoryChosen(category));
    this.service.nav(this.org, LIBRARY_ENTRY_CREATION_PAGES.PHASES);
  }
}
