import {
  ChangeDetectionStrategy,
  Component,
  inject,
  model,
} from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faFloppyDisk } from '@fortawesome/pro-solid-svg-icons';
import { TranslateModule } from '@ngx-translate/core';
import { DialogModule } from '@progress/kendo-angular-dialog';
import { SignalStore } from '@wbs/core/services';
import { ChangeProfileName } from '@wbs/main/actions';
import { AuthState } from '@wbs/main/states';

@Component({
  standalone: true,
  selector: 'wbs-profile-editor',
  templateUrl: './profile-editor.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DialogModule, FontAwesomeModule, TranslateModule],
})
export class ProfileEditorComponent {
  private readonly store = inject(SignalStore);

  readonly show = model.required<boolean>();
  readonly profile = this.store.select(AuthState.profile);
  readonly faFloppyDisk = faFloppyDisk;

  changeName(name: string): void {
    if ((name ?? '').trim().length === 0) return;

    this.store.dispatch(new ChangeProfileName(name));
    this.show.set(false);
  }
}
