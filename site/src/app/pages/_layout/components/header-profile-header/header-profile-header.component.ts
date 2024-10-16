import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { User, UserProfile } from '@wbs/core/models';
import { RoleListPipe } from '@wbs/pipes/role-list.pipe';
import { HeaderProfilePictureComponent } from '../header-profile-picture.component';

@Component({
  standalone: true,
  selector: 'wbs-header-profile-header',
  templateUrl: './header-profile-header.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [HeaderProfilePictureComponent, RoleListPipe],
})
export class HeaderProfileHeaderComponent {
  readonly user = input.required<User | UserProfile>();
  readonly roles = input.required<string[]>();
}
