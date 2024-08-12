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
import {
  faEnvelope,
  faUser,
  faUserTie,
} from '@fortawesome/pro-solid-svg-icons';
import { TranslateModule } from '@ngx-translate/core';
import { AvatarModule } from '@progress/kendo-angular-layout';
import { PopoverModule, Position } from '@progress/kendo-angular-tooltip';
import { UserService } from '@wbs/core/services';
import { UserViewModel } from '@wbs/core/view-models';

@Component({
  standalone: true,
  selector: 'wbs-user',
  templateUrl: './user.component.html',
  styleUrl: './user.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AvatarModule, FontAwesomeModule, PopoverModule, TranslateModule],
})
export class UserComponent implements OnChanges {
  private readonly userService = inject(UserService);

  readonly nameIcon = faUser;
  readonly titleIcon = faUserTie;
  readonly emailIcon = faEnvelope;
  readonly twitterIcon = faXTwitter;
  readonly linkedInIcon = faLinkedin;

  readonly position = input<Position>('bottom');
  readonly organization = input<string>();
  readonly userId = input<string>();
  readonly user = input<UserViewModel>();

  readonly show = signal(false);
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
