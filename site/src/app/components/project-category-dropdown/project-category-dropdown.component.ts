import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  model,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  DropDownListModule,
  DropDownSize,
} from '@progress/kendo-angular-dropdowns';
import { MetadataStore } from '@wbs/core/store';
import { ProjectCategoryDescriptionComponent } from '../_utils/project-category-description.component';

@Component({
  standalone: true,
  selector: 'wbs-project-category-dropdown',
  templateUrl: './project-category-dropdown.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    DropDownListModule,
    FormsModule,
    ProjectCategoryDescriptionComponent,
  ],
})
export class ProjectCategoryDropdownComponent {
  readonly categories = inject(MetadataStore).categories.projectCategories;
  readonly category = model.required<string | undefined>();
  readonly size = input<DropDownSize>('none');
  readonly listHeight = input(300);
  readonly popupWidth = input<number | string>('auto');
}
