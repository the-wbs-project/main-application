import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';
import { Store } from '@ngxs/store';
import { ListItem, PROJECT_NODE_VIEW } from '@wbs/shared/models';
import { MetadataState } from '@wbs/shared/states';
import { CategoryChosen } from '../../../project-create.actions';
import { ProjectCreateState } from '../../../project-create.state';

@Component({
  selector: 'app-project-pick-category',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
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
