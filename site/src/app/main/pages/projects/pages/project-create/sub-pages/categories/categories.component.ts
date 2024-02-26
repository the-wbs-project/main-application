import { ChangeDetectionStrategy, Component, Input, input } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Store } from '@ngxs/store';
import { ListItem } from '@wbs/core/models';
import { ProjectCategoryListComponent } from '@wbs/main/components/project-category-list';
import { WizardFooterComponent } from '@wbs/main/components/wizard-footer';
import { CategoryChosen } from '../../actions';
import { PROJECT_CREATION_PAGES } from '../../models';
import { ProjectCreateService } from '../../services';
import { ProjectCreateState } from '../../states';

@Component({
  standalone: true,
  templateUrl: './categories.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ProjectCategoryListComponent, WizardFooterComponent],
})
export class CategoriesComponent {
  readonly org = input.required<string>();
  readonly categories = input.required<ListItem[]>();
  readonly selected = toSignal(this.store.select(ProjectCreateState.category));

  constructor(
    private readonly service: ProjectCreateService,
    private readonly store: Store
  ) {}

  back(): void {
    this.service.nav(this.org(), PROJECT_CREATION_PAGES.BASICS);
  }

  continue(category: string): void {
    this.store.dispatch(new CategoryChosen(category));
    this.service.nav(this.org(), PROJECT_CREATION_PAGES.PHASES);
  }
}
