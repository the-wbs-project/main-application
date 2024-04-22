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
import { Auth0Service } from '@wbs/core/services';
import { UserStore } from '@wbs/store';

@Component({
  standalone: true,
  selector: 'wbs-profile-editor',
  templateUrl: './profile-editor.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DialogModule, FontAwesomeModule, TranslateModule],
})
export class ProfileEditorComponent {
  private readonly service = inject(Auth0Service);
  private readonly store = inject(UserStore);

  readonly show = model.required<boolean>();
  readonly profile = this.store.profile;
  readonly faFloppyDisk = faFloppyDisk;

  changeName(name: string): void {
    if ((name ?? '').trim().length === 0) return;

    this.service.changeProfileName(name).subscribe(() => this.show.set(false));
  }
}
