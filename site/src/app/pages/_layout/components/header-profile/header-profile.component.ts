import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
} from '@angular/core';
import { RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faCogs,
  faRightFromBracket,
  faUser,
} from '@fortawesome/pro-solid-svg-icons';
import { TranslateModule } from '@ngx-translate/core';
import { DialogService } from '@progress/kendo-angular-dialog';
import { ContextMenuModule } from '@progress/kendo-angular-menu';
import { DataServiceFactory } from '@wbs/core/data-services';
import { User } from '@wbs/core/models';
import { Messages } from '@wbs/core/services';
import { CheckPipe } from '@wbs/pipes/check.pipe';
import { RoleListPipe } from '@wbs/pipes/role-list.pipe';
import { HeaderProfileHeaderComponent } from '../header-profile-header';
import { HeaderProfilePictureComponent } from '../header-profile-picture.component';
import { ProfileEditorDialogComponent } from '../profile-editor-dialog';

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
    RoleListPipe,
    RouterModule,
    TranslateModule,
  ],
})
export class HeaderProfileComponent {
  private readonly data = inject(DataServiceFactory);
  private readonly dialog = inject(DialogService);
  private readonly messages = inject(Messages);
  readonly user = input.required<User>();
  readonly roles = input.required<string[] | undefined>();
  readonly faRightFromBracket = faRightFromBracket;
  readonly faUser = faUser;
  readonly faCogs = faCogs;
  readonly ADMIN_ROLE = 'site_admin';

  itemClicked(e: any): void {
    if (e.item.data === 'profile') {
      ProfileEditorDialogComponent.launch(
        this.dialog,
        structuredClone(this.user())
      );
    } else if (e.item.data === 'clearCache') {
      this.data.misc
        .clearKvCache()
        .subscribe(() => this.messages.notify.success('Cache cleared', false));
    } else if (e.item.data === 'rebuildSearchIndex') {
      this.data.misc
        .rebuildSearchIndex()
        .subscribe(() =>
          this.messages.notify.success('Search index rebuilt', false)
        );
    }
  }
}
