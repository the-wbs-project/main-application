import {
  ChangeDetectionStrategy,
  Component,
  Input,
  ViewEncapsulation,
} from '@angular/core';
import { WbsNodeView } from '@wbs/shared/view-models';

@Component({
  selector: 'wbs-level-popover',
  templateUrl: './level-popover.component.html',
  styleUrls: ['./level-popover.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class WbsLevelPopoverComponent {
  @Input() data: WbsNodeView | undefined;
}
