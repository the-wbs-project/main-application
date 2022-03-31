import {
  ChangeDetectionStrategy,
  Component,
  Input,
  ViewEncapsulation,
} from '@angular/core';
import { WbsNodeView } from '@wbs/models';

@Component({
  selector: 'wbs-level-popover',
  templateUrl: './level-popover.component.html',
  styleUrls: ['./level-popover.component.scss'],
  preserveWhitespaces: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class WbsLevelPopoverComponent {
  @Input() data: WbsNodeView | undefined;
}
