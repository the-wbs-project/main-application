import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  input,
  Output,
} from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { ListItem } from '@wbs/core/models';
import { SelectButtonComponent } from '@wbs/main/components/select-button.component';

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
  @Output() readonly selectedChange = new EventEmitter<string[]>();

  toggle(category: string): void {
    const selected = this.selected();

    if (selected.includes(category)) {
      this.selectedChange.emit(selected.filter((c) => c !== category));
    } else {
      this.selectedChange.emit([...selected, category]);
    }
  }
}
