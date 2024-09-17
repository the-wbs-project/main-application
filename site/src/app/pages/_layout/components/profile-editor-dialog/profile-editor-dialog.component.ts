import {
  ChangeDetectionStrategy,
  Component,
  inject,
  model,
  signal,
} from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faFloppyDisk } from '@fortawesome/pro-solid-svg-icons';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonModule } from '@progress/kendo-angular-buttons';
import {
  DialogContentBase,
  DialogModule,
  DialogService,
} from '@progress/kendo-angular-dialog';
import { SaveMessageComponent } from '@wbs/components/_utils/save-message.component';
import { ProfileEditorComponent } from '@wbs/components/profile-editor';
import { SaveState, User } from '@wbs/core/models';
import { Auth0Service } from '@wbs/core/services';
import { Observable } from 'rxjs';
import { delay, map, tap } from 'rxjs/operators';

@Component({
  standalone: true,
  selector: 'wbs-profile-editor-dialog',
  templateUrl: './profile-editor-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ButtonModule,
    DialogModule,
    FontAwesomeModule,
    ProfileEditorComponent,
    SaveMessageComponent,
    TranslateModule,
  ],
})
export class ProfileEditorDialogComponent extends DialogContentBase {
  private readonly service = inject(Auth0Service);

  readonly saveIcon = faFloppyDisk;
  readonly saving = signal<SaveState>('ready');
  readonly profile = model.required<User>();

  static launchAsync(dialog: DialogService, profile: User): Observable<void> {
    const ref = dialog.open({
      content: ProfileEditorDialogComponent,
    });
    const component = ref.content.instance as ProfileEditorDialogComponent;

    component.profile.set(profile);

    return ref.result.pipe(map(() => {}));
  }

  saveProfile(): void {
    this.saving.set('saving');
    this.service
      .saveProfile(this.profile())
      .pipe(
        tap(() => {
          this.saving.set('saved');
        }),
        delay(5000)
      )
      .subscribe(() => this.saving.set('ready'));
  }
}
