import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { WbsNodeView } from '@wbs/shared/view-models';

@Component({
  selector: 'wbs-node-general',
  templateUrl: './wbs-node-general.component.html',
  styleUrls: ['./wbs-node-general.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WbsNodeGeneralComponent {
  @Input() node?: WbsNodeView;
}
