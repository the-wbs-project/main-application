import {
  ChangeDetectionStrategy,
  Component,
  input,
  model,
} from '@angular/core';
import { RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faRightFromBracket, faUser } from '@fortawesome/pro-solid-svg-icons';
import { TranslateModule } from '@ngx-translate/core';
import { ContextMenuModule } from '@progress/kendo-angular-menu';
import { User } from '@wbs/core/models';
import { RoleListPipe } from '@wbs/pipes/role-list.pipe';
import { HeaderProfileHeaderComponent } from '../header-profile-header';
import { HeaderProfilePictureComponent } from '../header-profile-picture.component';
import { ProfileEditorComponent } from '../profile-editor';

@Component({
  standalone: true,
  selector: 'wbs-header-profile',
  templateUrl: './header-profile.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
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
  readonly user = input.required<User>();
  readonly roles = input.required<string[]>();
  readonly showProfileEditor = model(false);
  readonly faRightFromBracket = faRightFromBracket;
  readonly faUser = faUser;

  itemClicked(e: any): void {
    if (e.item.data === 'profile') {
      this.showProfileEditor.set(true);
    }
  }
}
