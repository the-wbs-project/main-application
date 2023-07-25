import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { ListItem } from '@wbs/core/models';
import { ProjectCategoryFilterPipe } from '../../pipes/project-category-filter.pipe';
import { ProjectCategorySortPipe } from '../../pipes/project-category-sort.pipe';
import { TextBoxModule } from '@progress/kendo-angular-inputs';
import { FillElementDirective } from '@wbs/main/directives/fill-element.directive';

@Component({
  standalone: true,
  selector: 'wbs-project-category-list',
  templateUrl: './category-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, FillElementDirective, ProjectCategoryFilterPipe, ProjectCategorySortPipe, TextBoxModule, TranslateModule]
})
export class CategoryListComponent {
  @Input() categories?: ListItem[];
  @Input() paddingBottom = 0;
  @Input() selected?: string;
  @Output() readonly categoryChosen = new EventEmitter<string>();
}
