import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faAlignLeft, faX } from '@fortawesome/pro-solid-svg-icons';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { Store } from '@ngxs/store';
import { SVGIconModule } from '@progress/kendo-angular-icons';
import { logoutIcon, userIcon } from '@progress/kendo-svg-icons';
import { RoleListPipe } from '@wbs/main/pipes/role-list.pipe';
import { DialogService } from '@wbs/main/services';
import { AuthState, MembershipState, UiState } from '@wbs/main/states';
import { ProfileEditorComponent } from '../profile-editor/profile-editor.component';
import { HeaderProfilePictureComponent } from './header-profile-picture.component';

@Component({
  standalone: true,
  selector: 'wbs-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  imports: [
    CommonModule,
    FontAwesomeModule,
    HeaderProfilePictureComponent,
    NgbDropdownModule,
    RoleListPipe,
    RouterModule,
    SVGIconModule,
    TranslateModule,
  ],
  providers: [DialogService],
})
export class HeaderComponent {
  readonly info = toSignal(this.store.select(UiState.header));
  readonly user = toSignal(this.store.select(AuthState.profile));
  readonly roles = toSignal(this.store.select(MembershipState.roles));
  readonly faAlignLeft = faAlignLeft;
  readonly faX = faX;
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
