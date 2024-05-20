import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Store } from '@ngxs/store';
import { ProjectCategoryListComponent } from '@wbs/components/project-category-list';
import { WizardFooterComponent } from '@wbs/components/wizard-footer';
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
