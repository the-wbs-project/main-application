import { NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterModule } from '@angular/router';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { Store } from '@ngxs/store';
import { SVGIconModule } from '@progress/kendo-angular-icons';
import { logoutIcon, userIcon } from '@progress/kendo-svg-icons';
import { RoleListPipe } from '@wbs/main/pipes/role-list.pipe';
import { DialogService } from '@wbs/main/services';
import { AuthState, RolesState } from '@wbs/main/states';
import { ProfileEditorComponent } from '../../profile-editor/profile-editor.component';
import { HeaderProfilePictureComponent } from './header-profile-picture.component';

@Component({
  standalone: true,
  selector: 'wbs-header-profile',
  templateUrl: './header-profile.component.html',
  styleUrls: ['./header-profile.component.scss'],
  providers: [DialogService],
  imports: [
    HeaderProfilePictureComponent,
    NgbDropdownModule,
    NgIf,
    RoleListPipe,
    RouterModule,
    SVGIconModule,
    TranslateModule,
  ],
})
export class HeaderProfileComponent {
  readonly user = toSignal(this.store.select(AuthState.profile));
  readonly roles = toSignal(this.store.select(RolesState.orgRoles));
  readonly logoutIcon = logoutIcon;
  readonly userIcon = userIcon;
  isCollapsed = true;

  constructor(
    private readonly dialog: DialogService,
    private readonly store: Store
  ) {}

  launchProfileEditor() {
    this.dialog
      .openDialog(ProfileEditorComponent, {
        size: 'md',
      })
      .subscribe();
  }
}
