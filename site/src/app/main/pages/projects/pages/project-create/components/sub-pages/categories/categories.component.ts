import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Store } from '@ngxs/store';
import { ListItem } from '@wbs/core/models';
import { MetadataState } from '@wbs/core/states';
import { CategoryListComponent } from '@wbs/main/pages/projects/components/category-list/category-list.component';
import { CategoryChosen } from '../../../actions';
import { ProjectCreateState } from '../../../states';
import { FooterComponent } from '../../footer/footer.component';

@Component({
  standalone: true,
  selector: 'wbs-project-pick-category',
  templateUrl: './categories.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CategoryListComponent, FooterComponent]
})
export class CategoriesComponent implements OnInit {
  categories?: ListItem[];
  selected?: string;

  constructor(private readonly store: Store) {}

  ngOnInit(): void {
    this.categories = this.store.selectSnapshot(
      MetadataState.projectCategories
    );
    this.selected = this.store.selectSnapshot(ProjectCreateState.category);
  }

  nav(category: string): void {
    this.store.dispatch(new CategoryChosen(category));
  }
}