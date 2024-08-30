import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faLinkedin, faXTwitter } from '@fortawesome/free-brands-svg-icons';
import { faEnvelope } from '@fortawesome/pro-solid-svg-icons';
import { TranslateModule } from '@ngx-translate/core';
import { AvatarModule } from '@progress/kendo-angular-layout';
import { UserViewModel } from '@wbs/core/view-models';

@Component({
  standalone: true,
  selector: 'wbs-user-info',
  templateUrl: './user-info.component.html',
  styleUrl: './user-info.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AvatarModule, FontAwesomeModule, TranslateModule],
})
export class UserInfoComponent {
  readonly emailIcon = faEnvelope;
  readonly twitterIcon = faXTwitter;
  readonly linkedInIcon = faLinkedin;

  readonly organization = input<string>();
  readonly userId = input<string>();
  readonly user = input<UserViewModel>();
  readonly secondaryTitle = input<string>();
}
