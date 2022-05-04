import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  ViewEncapsulation,
} from '@angular/core';

@Component({
  selector: 'wbs-node-bottom-buttons',
  templateUrl: './bottom-buttons.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class BottomButtonsComponent {
  @Input() hidePrevious = false;
  @Input() hideNext = false;
  @Input() labelPrevious = 'General.Previous';
  @Input() labelNext = 'General.Next';
  @Output() readonly previousClicked = new EventEmitter<void>();
  @Output() readonly nextClicked = new EventEmitter<void>();
}
