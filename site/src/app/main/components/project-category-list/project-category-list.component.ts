import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  output,
} from '@angular/core';
import { SelectButtonComponent } from '../select-button.component';
import { MetadataState } from '@wbs/main/services';

@Component({
  standalone: true,
  selector: 'wbs-project-category-list',
  templateUrl: './project-category-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SelectButtonComponent],
})
export class ProjectCategoryListComponent {
  readonly categories = inject(MetadataState).categories.projectCategories;

  readonly buttonClass = input<string>();
  readonly selected = input.required<string | undefined>();
  readonly categoryChosen = output<string>();
}
