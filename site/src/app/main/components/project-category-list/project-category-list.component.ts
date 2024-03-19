import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { ListItem } from '@wbs/core/models';
import { SelectButtonComponent } from '../select-button.component';

@Component({
  standalone: true,
  selector: 'wbs-project-category-list',
  templateUrl: './project-category-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SelectButtonComponent, TranslateModule],
})
export class ProjectCategoryListComponent {
  readonly buttonClass = input<string>();
  readonly categories = input.required<ListItem[]>();
  readonly selected = input.required<string | undefined>();
  readonly categoryChosen = output<string>();
}
