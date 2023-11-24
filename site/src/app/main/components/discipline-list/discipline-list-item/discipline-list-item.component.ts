import { NgClass } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { CategorySelection } from '@wbs/core/view-models';
import { DisciplineIconPipe } from '@wbs/main/pipes/discipline-icon.pipe';
import { ProjectCategoryLabelPipe } from '@wbs/main/pipes/project-category-label.pipe';
import { CategoryLabelPipe } from '../../../pipes/category-label.pipe';
import { SwitchComponent } from '../../switch';

@Component({
  standalone: true,
  selector: 'wbs-discipline-list-item',
  templateUrl: './discipline-list-item.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CategoryLabelPipe,
    DisciplineIconPipe,
    NgClass,
    ProjectCategoryLabelPipe,
    SwitchComponent,
  ],
})
export class DisciplineListItemComponent {
  @Input({ required: true }) hideUnselected!: boolean;
  @Input({ required: true }) cat!: CategorySelection;

  @Output() readonly changed = new EventEmitter<CategorySelection[]>();
}