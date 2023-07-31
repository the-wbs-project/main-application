import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';
import { Store } from '@ngxs/store';
import { PROJECT_NODE_VIEW, PROJECT_NODE_VIEW_TYPE } from '@wbs/core/models';
import { CategorySelectionService } from '@wbs/core/services';
import { CategoryListEditorComponent } from '@wbs/main/components/category-list-editor';
import { FillElementDirective } from '@wbs/main/directives/fill-element.directive';
import { CategorySelection } from '@wbs/core/view-models';
import { PhasesChosen } from '../../../actions';
import { ProjectCreateState } from '../../../states';
import { FooterComponent } from '../../footer/footer.component';

@Component({
  standalone: true,
  selector: 'wbs-project-create-phases',
  templateUrl: './phases.component.html',
  styleUrls: ['./phases.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [CategoryListEditorComponent, FillElementDirective, FooterComponent],
})
export class PhaseComponent implements OnInit {
  categories?: CategorySelection[];
  phase: PROJECT_NODE_VIEW_TYPE = PROJECT_NODE_VIEW.PHASE;

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
      new PhasesChosen(this.catService.extract(this.categories, []).categories)
    );
  }
}
