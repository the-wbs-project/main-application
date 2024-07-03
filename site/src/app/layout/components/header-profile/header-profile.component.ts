import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  model,
} from '@angular/core';
import { RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faCogs,
  faRightFromBracket,
  faUser,
} from '@fortawesome/pro-solid-svg-icons';
import { TranslateModule } from '@ngx-translate/core';
import { ContextMenuModule } from '@progress/kendo-angular-menu';
import { ROLES, User } from '@wbs/core/models';
import { RoleListPipe } from '@wbs/pipes/role-list.pipe';
import { HeaderProfileHeaderComponent } from '../header-profile-header';
import { HeaderProfilePictureComponent } from '../header-profile-picture.component';
import { ProfileEditorComponent } from '../profile-editor';
import { CheckPipe } from '@wbs/pipes/check.pipe';
import { DataServiceFactory } from '@wbs/core/data-services';
import { Messages } from '@wbs/core/services';

@Component({
  standalone: true,
  selector: 'wbs-header-profile',
  templateUrl: './header-profile.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CheckPipe,
    ContextMenuModule,
    FontAwesomeModule,
    HeaderProfileHeaderComponent,
    HeaderProfilePictureComponent,
    ProfileEditorComponent,
    RoleListPipe,
    RouterModule,
    TranslateModule,
  ],
})
export class HeaderProfileComponent {
  private readonly data = inject(DataServiceFactory);
  private readonly messages = inject(Messages);
  readonly user = input.required<User>();
  readonly roles = input.required<string[] | undefined>();
  readonly showProfileEditor = model(false);
  readonly faRightFromBracket = faRightFromBracket;
  readonly faUser = faUser;
  readonly faCogs = faCogs;
  readonly ADMIN_ROLE = 'site_admin';

  itemClicked(e: any): void {
    if (e.item.data === 'profile') {
      this.showProfileEditor.set(true);
    } else if (e.item.data === 'clearCache') {
      this.data.misc
        .clearKvCache()
        .subscribe(() => this.messages.notify.success('Cache cleared', false));
    }
  }
}
