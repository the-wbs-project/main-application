import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  OnChanges,
  signal,
} from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { PopoverModule, Position } from '@progress/kendo-angular-tooltip';
import { UserService } from '@wbs/core/services';
import { UserViewModel } from '@wbs/core/view-models';
import { UserInfoComponent } from '../user-info';

@Component({
  standalone: true,
  selector: 'wbs-user',
  templateUrl: './user.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [PopoverModule, TranslateModule, UserInfoComponent],
})
export class UserComponent implements OnChanges {
  private readonly userService = inject(UserService);

  readonly position = input<Position>('bottom');
  readonly organization = input<string>();
  readonly userId = input<string>();
  readonly user = input<UserViewModel>();

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
