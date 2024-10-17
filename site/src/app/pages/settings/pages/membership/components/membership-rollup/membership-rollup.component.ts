import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faSpinner } from '@fortawesome/pro-duotone-svg-icons';
import { TranslateModule } from '@ngx-translate/core';
import { MembersSettingStore } from '../../store';

@Component({
  standalone: true,
  selector: 'wbs-membership-rollup',
  templateUrl: './membership-rollup.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FontAwesomeModule, TranslateModule],
})
export class MembershipRollupComponent {
  readonly store = inject(MembersSettingStore);
  readonly faSpinner = faSpinner;
}
