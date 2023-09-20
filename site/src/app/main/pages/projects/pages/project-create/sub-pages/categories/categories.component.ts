import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Store } from '@ngxs/store';
import { CategoryListComponent } from '@wbs/main/pages/projects/components/category-list/category-list.component';
import { MetadataState } from '@wbs/main/states';
import { CategoryChosen } from '../../actions';
import { FooterComponent } from '../../components/footer/footer.component';
import { PROJECT_CREATION_PAGES } from '../../models';
import { ProjectCreateService } from '../../services';
import { ProjectCreateState } from '../../states';

@Component({
  standalone: true,
  templateUrl: './categories.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CategoryListComponent, FooterComponent],
})
export class CategoriesComponent {
  @Input() org!: string;

  readonly categories = toSignal(
    this.store.select(MetadataState.projectCategories)
  );
  readonly selected = toSignal(this.store.select(ProjectCreateState.category));

  constructor(
    private readonly service: ProjectCreateService,
    private readonly store: Store
  ) {}

  back(): void {
    this.service.nav(this.org, PROJECT_CREATION_PAGES.BASICS);
  }

  continue(category: string): void {
    this.store.dispatch(new CategoryChosen(category));
    this.service.nav(this.org, PROJECT_CREATION_PAGES.PHASES);
  }
}
