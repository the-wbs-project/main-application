import { ChangeDetectionStrategy, Component } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Store } from '@ngxs/store';
import { CategoryListComponent } from '@wbs/main/pages/projects/components/category-list/category-list.component';
import { MetadataState } from '@wbs/main/states';
import { CategoryChosen } from '../../../actions';
import { ProjectCreateState } from '../../../states';
import { FooterComponent } from '../../footer/footer.component';

@Component({
  standalone: true,
  selector: 'wbs-project-pick-category',
  templateUrl: './categories.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CategoryListComponent, FooterComponent],
})
export class CategoriesComponent {
  readonly categories = toSignal(
    this.store.select(MetadataState.projectCategories)
  );
  readonly selected = toSignal(this.store.select(ProjectCreateState.category));

  constructor(private readonly store: Store) {}

  nav(category: string): void {
    this.store.dispatch(new CategoryChosen(category));
  }
}
