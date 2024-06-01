import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { ListItem } from '@wbs/core/models';
import { SelectButtonComponent } from '@wbs/components/_utils/select-button.component';

@Component({
  standalone: true,
  selector: 'wbs-project-category-multiple-list',
  templateUrl: './project-category-multiple-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SelectButtonComponent, TranslateModule],
})
export class ProjectCategoryMultipleListComponent {
  readonly buttonClass = input<string>();
  readonly categories = input.required<ListItem[]>();
  readonly selected = input.required<string[]>();
  readonly selectedChange = output<string[]>();

  toggle(category: string): void {
    const selected = this.selected();

    if (selected.includes(category)) {
      this.selectedChange.emit(selected.filter((c) => c !== category));
    } else {
      this.selectedChange.emit([...selected, category]);
    }
  }
}
