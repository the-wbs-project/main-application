import {
  ChangeDetectionStrategy,
  Component,
  input,
  model,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { DropDownListModule } from '@progress/kendo-angular-dropdowns';
import { ListItem } from '@wbs/core/models';

@Component({
  standalone: true,
  selector: 'wbs-project-category-dropdown',
  templateUrl: './project-category-dropdown.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DropDownListModule, FormsModule, TranslateModule],
})
export class ProjectCategoryDropdownComponent {
  readonly categories = input.required<ListItem[]>();
  readonly category = model.required<string | undefined>();
}
