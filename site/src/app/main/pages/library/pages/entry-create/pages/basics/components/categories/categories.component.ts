import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Store } from '@ngxs/store';
import { ListItem } from '@wbs/core/models';
import { ProjectCategoryMultipleListComponent } from '@wbs/main/components/project-category-multiple-list';
import { WizardFooterComponent } from '@wbs/main/components/wizard-footer';
import { LIBRARY_ENTRY_CREATION_PAGES } from '../../../../models';

@Component({
  standalone: true,
  templateUrl: './categories.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ProjectCategoryMultipleListComponent, WizardFooterComponent],
})
export class CategoriesComponent {
  @Input() org!: string;
  @Input() type!: string;
  @Input() categories!: ListItem[];
  @Input() selected!: string[];

  constructor(private readonly store: Store) {}
}
