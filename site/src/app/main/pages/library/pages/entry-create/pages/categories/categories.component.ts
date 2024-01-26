import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Store } from '@ngxs/store';
import { ListItem } from '@wbs/core/models';
import { ProjectCategoryMultipleListComponent } from '@wbs/main/components/project-category-multiple-list';
import { WizardFooterComponent } from '@wbs/main/components/wizard-footer';
import { CategoriesChosen } from '../../actions';
import { LIBRARY_ENTRY_CREATION_PAGES } from '../../models';
import { LibraryEntryCreateService } from '../../services';

@Component({
  standalone: true,
  templateUrl: './categories.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ProjectCategoryMultipleListComponent, WizardFooterComponent],
})
export class CategoriesComponent {
  @Input() org!: string;
  @Input() type!: string;
  @Input() categories!: ListItem[];
  @Input() selected!: string[];

  constructor(
    private readonly service: LibraryEntryCreateService,
    private readonly store: Store
  ) {}

  back(): void {
    this.service.nav(this.org, LIBRARY_ENTRY_CREATION_PAGES.GETTING_STARTED);
  }

  continue(): void {
    this.store.dispatch(new CategoriesChosen(this.selected));
    this.service.nav(this.org, LIBRARY_ENTRY_CREATION_PAGES.PHASES);
  }
}
