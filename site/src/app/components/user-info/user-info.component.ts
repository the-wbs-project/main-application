import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  OnChanges,
  signal,
} from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faLinkedin, faXTwitter } from '@fortawesome/free-brands-svg-icons';
import { faEnvelope } from '@fortawesome/pro-solid-svg-icons';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonModule } from '@progress/kendo-angular-buttons';
import { AvatarModule } from '@progress/kendo-angular-layout';
import { UserService } from '@wbs/core/services';
import { UserViewModel } from '@wbs/core/view-models';

@Component({
  standalone: true,
  selector: 'wbs-user-info',
  templateUrl: './user-info.component.html',
  styleUrl: './user-info.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AvatarModule, ButtonModule, FontAwesomeModule, TranslateModule],
})
export class UserInfoComponent implements OnChanges {
  private readonly userService = inject(UserService);

  readonly emailIcon = faEnvelope;
  readonly twitterIcon = faXTwitter;
  readonly linkedInIcon = faLinkedin;

  readonly organization = input<string>();
  readonly userId = input<string>();
  readonly user = input<UserViewModel>();
  readonly secondaryTitle = input<string>();

  readonly userVm = signal<UserViewModel | undefined>(undefined);

  ngOnChanges(): void {
    const user = this.user();

    if (user) {
      this.userVm.set(user);
    } else {
      const organization = this.organization();
      const userId = this.userId();

      if (organization && userId) {
        this.userService
          .getUserAsync(organization, userId)
          .subscribe((user) => this.userVm.set(user));
      }
    }
  }
}
