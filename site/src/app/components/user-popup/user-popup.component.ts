import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  OnChanges,
  signal,
  SimpleChanges,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faLinkedin, faXTwitter } from '@fortawesome/free-brands-svg-icons';
import {
  faEnvelope,
  faUser,
  faUserTie,
} from '@fortawesome/pro-solid-svg-icons';
import { TranslateModule } from '@ngx-translate/core';
import { AvatarModule } from '@progress/kendo-angular-layout';
import { PopoverModule } from '@progress/kendo-angular-tooltip';
import { UserService } from '@wbs/core/services';
import { UserViewModel } from '@wbs/core/view-models';

@Component({
  standalone: true,
  selector: 'wbs-user-popup',
  templateUrl: './user-popup.component.html',
  styleUrl: './user-popup.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AvatarModule, FontAwesomeModule, PopoverModule, TranslateModule],
})
export class UserPopupComponent implements OnChanges {
  private readonly userService = inject(UserService);

  readonly nameIcon = faUser;
  readonly titleIcon = faUserTie;
  readonly emailIcon = faEnvelope;
  readonly twitterIcon = faXTwitter;
  readonly linkedInIcon = faLinkedin;

  readonly organization = input.required<string>();
  readonly userId = input.required<string>();

  readonly show = signal(false);
  readonly user = signal<UserViewModel | undefined>(undefined);

  ngOnChanges(changes: SimpleChanges): void {
    const organization = this.organization();
    const userId = this.userId();

    if (organization && userId) {
      this.userService
        .getUserAsync(this.organization(), this.userId())
        .subscribe((user) => this.user.set(user));
    }
  }
}
