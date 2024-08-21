import { NgClass } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  OnChanges,
  signal,
} from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { UserService } from '@wbs/core/services';
import { UserViewModel } from '@wbs/core/view-models';
import { UserInfoComponent } from '../user-info';

@Component({
  standalone: true,
  selector: 'wbs-user-card',
  templateUrl: './user-card.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgClass, TranslateModule, UserInfoComponent],
})
export class UserCardComponent implements OnChanges {
  private readonly userService = inject(UserService);

  readonly organization = input<string>();
  readonly userId = input<string>();
  readonly user = input<UserViewModel>();
  readonly cardHeader = input.required<string>();
  readonly cardClass = input<string | string[]>();
  readonly cardHeaderClass = input<string | string[]>();
  readonly cardBodyClass = input<string | string[]>();

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
