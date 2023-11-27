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
import { DisciplineEditorComponent } from '@wbs/main/components/discipline-editor';
import { FillElementDirective } from '@wbs/main/directives/fill-element.directive';
import { CategorySelectionService } from '@wbs/main/services';
import { DisciplinesChosen } from '../../actions';
import { FooterComponent } from '../../components/footer/footer.component';
import { PROJECT_CREATION_PAGES } from '../../models';
import { ProjectCreateService } from '../../services';
import { ProjectCreateState } from '../../states';

@Component({
  standalone: true,
  templateUrl: './disciplines.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [DisciplineEditorComponent, FillElementDirective, FooterComponent],
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
    const selected = this.store.selectSnapshot(ProjectCreateState.disciplines);

    this.categories = this.catService.build(
      PROJECT_NODE_VIEW.DISCIPLINE,
      selected
    );
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
