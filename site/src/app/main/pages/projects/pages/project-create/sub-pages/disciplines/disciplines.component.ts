import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';
import { Store } from '@ngxs/store';
import { CategorySelection } from '@wbs/core/view-models';
import { DisciplineEditorComponent } from '@wbs/main/components/discipline-editor';
import { WizardFooterComponent } from '@wbs/main/components/wizard-footer';
import { FillElementDirective } from '@wbs/main/directives/fill-element.directive';
import { CategorySelectionService } from '@wbs/main/services';
import { MetadataState } from '@wbs/main/states';
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
  @Input() org!: string;

  categories?: CategorySelection[];

  constructor(
    private readonly catService: CategorySelectionService,
    private readonly service: ProjectCreateService,
    private readonly store: Store
  ) {}

  ngOnInit(): void {
    const categories = this.store.selectSnapshot(MetadataState.disciplines);
    const selected = this.store.selectSnapshot(ProjectCreateState.disciplines);

    this.categories = this.catService.build(categories, selected);
  }

  back(): void {
    this.service.nav(this.org, PROJECT_CREATION_PAGES.PHASES);
  }

  continue(): void {
    const disciplines = this.catService.extract(this.categories, []).categories;

    if (disciplines.length === 0) return;

    this.store.dispatch(new DisciplinesChosen(disciplines));
    this.service.nav(this.org, PROJECT_CREATION_PAGES.ROLES);
  }

  disable(categories: CategorySelection[] | undefined): boolean {
    return categories ? categories.every((c) => !c.selected) : true;
  }
}
