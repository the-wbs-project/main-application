import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  output,
} from '@angular/core';
import { SelectButtonComponent } from '@wbs/components/_utils/select-button.component';
import { MetadataStore } from '@wbs/store';

@Component({
  standalone: true,
  selector: 'wbs-project-category-list',
  templateUrl: './project-category-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SelectButtonComponent],
})
export class ProjectCategoryListComponent {
  readonly categories = inject(MetadataStore).categories.projectCategories;

  readonly buttonClass = input<string>();
  readonly selected = input.required<string | undefined>();
  readonly categoryChosen = output<string>();
}
