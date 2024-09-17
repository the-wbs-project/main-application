import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
} from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { SVGIconModule, SVGIcon } from '@progress/kendo-angular-icons';
import { sorter } from '@wbs/core/services';
import { UserViewModel } from '@wbs/core/view-models';
import { UserComponent } from '../user/user.component';

@Component({
  standalone: true,
  selector: 'wbs-user-list',
  templateUrl: './user-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SVGIconModule, TranslateModule, UserComponent],
})
export class UserListComponent {
  readonly selected = output<UserViewModel>();

  readonly icon = input.required<SVGIcon>();
  readonly users = input.required<UserViewModel[] | undefined>();
  readonly noUsersLabel = input<string>();

  readonly sortedUsers = computed(() =>
    (this.users() ?? []).sort((a, b) => sorter(a.fullName, b.fullName))
  );
}
