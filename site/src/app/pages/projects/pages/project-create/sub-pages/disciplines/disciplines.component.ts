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
import { CategorySelection } from '@wbs/core/view-models';
import { DisciplineEditorComponent } from '@wbs/main/components/discipline-editor';
import { WizardFooterComponent } from '@wbs/main/components/wizard-footer';
import { CategorySelectionService } from '@wbs/main/services';
import { DisciplinesChosen } from '../../actions';
import { PROJECT_CREATION_PAGES } from '../../models';
import { ProjectCreateService } from '../../services';
import { ProjectCreateState } from '../../states';

@Component({
  standalone: true,
  templateUrl: './disciplines.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [
    DisciplineEditorComponent,
    FillElementDirective,
    WizardFooterComponent,
  ],
  providers: [CategorySelectionService],
})
export class DisciplinesComponent implements OnInit {
  private readonly catService = inject(CategorySelectionService);
  private readonly service = inject(ProjectCreateService);
  private readonly store = inject(Store);

  readonly org = input.required<string>();
  categories?: CategorySelection[];

  ngOnInit(): void {
    const selected = this.store.selectSnapshot(ProjectCreateState.disciplines);

    this.categories = this.catService.buildDisciplines(selected);
  }

  back(): void {
    this.service.nav(this.org(), PROJECT_CREATION_PAGES.PHASES);
  }

  continue(): void {
    const disciplines = this.catService.extract(this.categories, []).categories;

    if (disciplines.length === 0) return;

    this.store.dispatch(new DisciplinesChosen(disciplines));
    this.service.nav(this.org(), PROJECT_CREATION_PAGES.ROLES);
  }

  disable(categories: CategorySelection[] | undefined): boolean {
    return categories ? categories.every((c) => !c.selected) : true;
  }
}
