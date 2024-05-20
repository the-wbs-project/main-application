import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faSpinner } from '@fortawesome/pro-duotone-svg-icons';
import { TranslateModule } from '@ngx-translate/core';
import { Organization } from '@wbs/core/models';

@Component({
  standalone: true,
  selector: 'wbs-membership-rollup',
  templateUrl: './membership-rollup.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FontAwesomeModule, TranslateModule],
})
export class MembershipRollupComponent {
  readonly isLoading = input.required<boolean>();
  readonly organization = input.required<Organization | undefined>();
  readonly memberCount = input.required<number>();
  readonly inviteCount = input.required<number>();
  readonly capacity = input.required<number | undefined>();
  readonly remaining = input.required<number | undefined>();
  readonly faSpinner = faSpinner;
}
