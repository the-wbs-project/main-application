import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  ViewEncapsulation,
} from '@angular/core';
import { ListItem } from '@wbs/models';

@Component({
  selector: 'wbs-node-create-p1',
  templateUrl: './page-1.component.html',
  styleUrls: ['./page-1.component.scss'],
  preserveWhitespaces: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class Page1Component {
  @Input() value: ListItem | undefined;
  @Output() readonly valueChange = new EventEmitter<ListItem>();

  set(value: ListItem) {
    this.value = value;
    this.valueChange.emit(value);
  }
}
