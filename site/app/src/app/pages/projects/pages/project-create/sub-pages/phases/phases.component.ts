import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  ViewEncapsulation,
  inject,
  input,
} from '@angular/core';
import { Store } from '@ngxs/store';
import { FillElementDirective } from '@wbs/core/directives/fill-element.directive';
import { CategoryService } from '@wbs/core/services';
import { CategorySelection } from '@wbs/core/view-models';
import { PhaseEditorComponent } from '@wbs/components/phase-editor';
import { WizardFooterComponent } from '@wbs/components/wizard-footer';
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
})
export class PhaseComponent implements OnInit {
  private readonly catService = inject(CategoryService);
  private readonly service = inject(ProjectCreateService);
  private readonly store = inject(Store);

  readonly org = input.required<string>();
  categories?: CategorySelection[];

  ngOnInit(): void {
    this.categories = this.catService.buildPhases(
      this.store.selectSnapshot(ProjectCreateState.phases)
    );
  }

  back(): void {
    this.service.nav(this.org(), PROJECT_CREATION_PAGES.CATEGORY);
  }

  continue(): void {
    const phases = this.catService.extract(this.categories, []).categories;

    if (phases.length === 0) return;

    this.store.dispatch(new PhasesChosen(phases));
    this.service.nav(this.org(), PROJECT_CREATION_PAGES.DISCIPLINES);
  }

  disable(categories: CategorySelection[] | undefined): boolean {
    return categories ? categories.every((c) => !c.selected) : true;
  }
}
