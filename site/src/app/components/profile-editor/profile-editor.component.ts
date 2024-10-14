import { ChangeDetectionStrategy, Component, model } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faLinkedin, faXTwitter } from '@fortawesome/free-brands-svg-icons';
import {
  faEnvelope,
  faEye,
  faInfo,
  faPencil,
  faUser,
  faUserTie,
} from '@fortawesome/pro-solid-svg-icons';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonModule } from '@progress/kendo-angular-buttons';
import { LabelModule } from '@progress/kendo-angular-label';
import { AvatarModule } from '@progress/kendo-angular-layout';
import { UserProfile } from '@wbs/core/models';

@Component({
  standalone: true,
  selector: 'wbs-profile-editor',
  templateUrl: './profile-editor.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    AvatarModule,
    ButtonModule,
    FontAwesomeModule,
    FormsModule,
    LabelModule,
    TranslateModule,
  ],
})
export class ProfileEditorComponent {
  readonly profile = model.required<UserProfile | undefined>();
  readonly eyeIcon = faEye;
  readonly infoIcon = faInfo;
  readonly nameIcon = faUser;
  readonly editIcon = faPencil;
  readonly titleIcon = faUserTie;
  readonly emailIcon = faEnvelope;
  readonly twitterIcon = faXTwitter;
  readonly linkedInIcon = faLinkedin;
  file: string = '';

  toggleVisibility(profile: UserProfile, item: string) {
    let list = [...profile.showExternally];

    profile.showExternally = profile.showExternally.includes(item)
      ? list.filter((v) => v !== item)
      : [...list, item];
  }
}
