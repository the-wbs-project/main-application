import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { PopoverModule, Position } from '@progress/kendo-angular-tooltip';
import { User } from '@wbs/core/models';
import { UserInfoComponent } from '../user-info';

@Component({
  standalone: true,
  selector: 'wbs-user',
  templateUrl: './user.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [PopoverModule, TranslateModule, UserInfoComponent],
})
export class UserComponent {
  readonly position = input<Position>('bottom');
  readonly user = input<User>();
}
