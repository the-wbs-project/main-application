import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import {
  DialogContentBase,
  DialogModule,
  DialogService,
} from '@progress/kendo-angular-dialog';
import { SaveButtonComponent } from '@wbs/components/_utils/save-button.component';
import { ProfileEditorComponent } from '@wbs/components/profile-editor';
import { User } from '@wbs/core/models';
import { Auth0Service, Messages, SaveService } from '@wbs/core/services';

@Component({
  standalone: true,
  templateUrl: './profile-editor-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    DialogModule,
    ProfileEditorComponent,
    SaveButtonComponent,
    TranslateModule,
  ],
})
export class ProfileEditorDialogComponent extends DialogContentBase {
  private readonly service = inject(Auth0Service);
  private readonly messages = inject(Messages);

  readonly saveState = new SaveService();
  readonly profile = signal<User | undefined>(undefined);

  static launch(dialog: DialogService, profile: User): void {
    const ref = dialog.open({
      content: ProfileEditorDialogComponent,
    });
    const component = ref.content.instance as ProfileEditorDialogComponent;

    component.profile.set(profile);
  }

  saveProfile(): void {
    this.saveState
      .quickCall(this.service.saveProfile(this.profile()!))
      .subscribe(() => {
        this.dialog.close();
        this.messages.notify.success('Profile.ProfileUpdated');
      });
  }
}
