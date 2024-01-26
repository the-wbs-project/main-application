import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
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
  @Input({ required: true }) categories!: ListItem[];
  @Input({ required: true }) selected!: string[];
  @Output() readonly selectedChange = new EventEmitter<string[]>();

  toggle(category: string): void {
    if (this.selected.includes(category)) {
      this.selectedChange.emit(this.selected.filter((c) => c !== category));
    } else {
      this.selectedChange.emit([...this.selected, category]);
    }
  }
}
