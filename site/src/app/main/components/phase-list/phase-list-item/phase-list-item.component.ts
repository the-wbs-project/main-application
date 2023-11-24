import { NgIf } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  ViewEncapsulation,
} from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { CategorySelection } from '@wbs/core/view-models';
import { SwitchComponent } from '../../switch';

@Component({
  standalone: true,
  selector: 'wbs-phase-list-item',
  templateUrl: './phase-list-item.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [NgIf, SwitchComponent, TranslateModule],
})
export class PhaseListItemComponent {
  @Input({ required: true }) hideUnselected!: boolean;
  @Input({ required: true }) cat!: CategorySelection;

  @Output() readonly changed = new EventEmitter<CategorySelection[]>();
}