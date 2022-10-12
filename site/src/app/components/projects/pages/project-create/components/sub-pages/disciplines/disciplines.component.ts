import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';
import { Store } from '@ngxs/store';
import { PROJECT_NODE_VIEW, PROJECT_NODE_VIEW_TYPE } from '@wbs/shared/models';
import { CategorySelectionService } from '@wbs/shared/services';
import { CategorySelection } from '@wbs/shared/view-models';
import { DisciplinesChosen } from '../../../project-create.actions';
import { ProjectCreateState } from '../../../project-create.state';

@Component({
  selector: 'app-project-create-disciplines',
  templateUrl: './disciplines.component.html',
  styleUrls: ['./disciplines.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class DisciplinesComponent implements OnInit {
  categories?: CategorySelection[];
  discipline: PROJECT_NODE_VIEW_TYPE = PROJECT_NODE_VIEW.DISCIPLINE;

  constructor(
    private readonly catService: CategorySelectionService,
    private readonly store: Store
  ) {}

  ngOnInit(): void {
    const selected = this.store.selectSnapshot(ProjectCreateState.disciplines);

    this.categories = this.catService.build(
      PROJECT_NODE_VIEW.DISCIPLINE,
      selected
    );
  }

  nav(): void {
    this.store.dispatch(
      new DisciplinesChosen(this.catService.extract(this.categories, false))
    );
  }
}
