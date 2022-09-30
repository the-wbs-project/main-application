import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';
import { Store } from '@ngxs/store';
import { PROJECT_NODE_VIEW } from '@wbs/shared/models';
import { CategorySelectionService } from '@wbs/shared/services';
import { CategorySelection } from '@wbs/shared/view-models';
import { PhasesChosen } from '../../../project-create.actions';
import { ProjectCreateState } from '../../../project-create.state';

@Component({
  selector: 'app-project-create-phases',
  templateUrl: './phases.component.html',
  styleUrls: ['./phases.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class PhaseComponent implements OnInit {
  categories?: CategorySelection[];

  constructor(
    private readonly catService: CategorySelectionService,
    private readonly store: Store
  ) {}

  ngOnInit(): void {
    const selected = this.store.selectSnapshot(ProjectCreateState.phases);

    this.categories = this.catService.build(PROJECT_NODE_VIEW.PHASE, selected);
  }

  nav(): void {
    this.store.dispatch(
      new PhasesChosen(this.catService.extract(this.categories, false))
    );
  }
}
