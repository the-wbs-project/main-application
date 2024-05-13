import {
  ChangeDetectionStrategy,
  Component,
  inject,
  model,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DropDownListModule } from '@progress/kendo-angular-dropdowns';
import { MetadataStore } from '@wbs/core/store';

@Component({
  standalone: true,
  selector: 'wbs-project-category-dropdown',
  templateUrl: './project-category-dropdown.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DropDownListModule, FormsModule],
})
export class ProjectCategoryDropdownComponent {
  readonly categories = inject(MetadataStore).categories.projectCategories;
  readonly category = model.required<string | undefined>();
}
