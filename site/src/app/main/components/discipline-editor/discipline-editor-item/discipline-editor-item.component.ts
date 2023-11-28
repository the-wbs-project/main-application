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
import { DisciplineLabelPipe } from '@wbs/main/pipes/discipline-label.pipe';
import { SwitchComponent } from '../../switch';

@Component({
  standalone: true,
  selector: 'wbs-discipline-editor-item',
  templateUrl: './discipline-editor-item.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    DisciplineIconPipe,
    DisciplineLabelPipe,
    NgClass,
    SwitchComponent,
  ],
})
export class DisciplineEditorItemComponent {
  @Input({ required: true }) hideUnselected!: boolean;
  @Input({ required: true }) cat!: CategorySelection;

  @Output() readonly changed = new EventEmitter<CategorySelection[]>();
}
