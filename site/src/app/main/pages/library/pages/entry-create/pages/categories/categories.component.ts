import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Store } from '@ngxs/store';
import { ListItem } from '@wbs/core/models';
import { WizardFooterComponent } from '@wbs/main/components/wizard-footer/wizard-footer.component';
import { CategoryListComponent } from '@wbs/main/pages/projects/components/category-list/category-list.component';
import { CategoryChosen } from '../../actions';
import { LIBRARY_ENTRY_CREATION_PAGES } from '../../models';
import { LibraryEntryCreateService } from '../../services';
import { ProjectCreateState } from '../../states';

@Component({
  standalone: true,
  templateUrl: './categories.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CategoryListComponent, WizardFooterComponent],
})
export class CategoriesComponent {
  @Input() org!: string;
  @Input() categories!: ListItem[];

  readonly selected = toSignal(this.store.select(ProjectCreateState.category));

  constructor(
    private readonly service: LibraryEntryCreateService,
    private readonly store: Store
  ) {}

  back(): void {
    this.service.nav(this.org, LIBRARY_ENTRY_CREATION_PAGES.BASICS);
  }

  continue(category: string): void {
    this.store.dispatch(new CategoryChosen(category));
    this.service.nav(this.org, LIBRARY_ENTRY_CREATION_PAGES.PHASES);
  }
}
