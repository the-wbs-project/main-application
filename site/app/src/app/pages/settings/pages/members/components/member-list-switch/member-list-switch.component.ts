import { ChangeDetectionStrategy, Component, model } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import {
  ButtonGroupModule,
  ButtonModule,
} from '@progress/kendo-angular-buttons';

@Component({
  standalone: true,
  selector: 'wbs-member-list-switch',
  templateUrl: './member-list-switch.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ButtonGroupModule, ButtonModule, TranslateModule],
})
export class MemberListSwitchComponent {
  readonly view = model.required<'members' | 'invites'>();
}
