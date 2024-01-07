import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';
import { Store } from '@ngxs/store';
import { PROJECT_NODE_VIEW } from '@wbs/core/models';
import { CategorySelection } from '@wbs/core/view-models';
import { PhaseEditorComponent } from '@wbs/main/components/phase-editor';
import { WizardFooterComponent } from '@wbs/main/components/wizard-footer/wizard-footer.component';
import { FillElementDirective } from '@wbs/main/directives/fill-element.directive';
import { CategorySelectionService } from '@wbs/main/services';
import { PhasesChosen } from '../../actions';
import { PROJECT_CREATION_PAGES } from '../../models';
import { ProjectCreateService } from '../../services';
import { ProjectCreateState } from '../../states';

@Component({
  standalone: true,
  templateUrl: './phases.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [PhaseEditorComponent, FillElementDirective, WizardFooterComponent],
  providers: [CategorySelectionService],
})
export class PhaseComponent implements OnInit {
  @Input() org!: string;

  categories?: CategorySelection[];

  constructor(
    private readonly catService: CategorySelectionService,
    private readonly service: ProjectCreateService,
    private readonly store: Store
  ) {}

  ngOnInit(): void {
    const selected = this.store.selectSnapshot(ProjectCreateState.phases);

    this.categories = this.catService.build(PROJECT_NODE_VIEW.PHASE, selected);
  }

  back(): void {
    this.service.nav(this.org, PROJECT_CREATION_PAGES.CATEGORY);
  }

  continue(): void {
    const phases = this.catService.extract(this.categories, []).categories;

    if (phases.length === 0) return;

    this.store.dispatch(new PhasesChosen(phases));
    this.service.nav(this.org, PROJECT_CREATION_PAGES.DISCIPLINES);
  }

  disable(categories: CategorySelection[] | undefined): boolean {
    return categories ? categories.every((c) => !c.selected) : true;
  }
}
