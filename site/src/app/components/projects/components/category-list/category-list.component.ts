import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { ListItem } from '@wbs/shared/models';

@Component({
  selector: 'app-project-category-list',
  templateUrl: './category-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CategoryListComponent {
  @Input() categories?: ListItem[];
  @Input() paddingBottom = 0;
  @Input() selected?: string;
  @Output() readonly categoryChosen = new EventEmitter<string>();
}
