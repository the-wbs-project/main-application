import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  model,
} from '@angular/core';
import { SelectButtonComponent } from '@wbs/components/_utils/select-button.component';
import { MetadataStore } from '@wbs/core/store';

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
  readonly category = model.required<string | undefined>();
}
