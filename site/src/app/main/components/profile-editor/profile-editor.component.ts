import { ChangeDetectionStrategy, Component } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NgbActiveModal, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { Store } from '@ngxs/store';
import { SVGIconModule } from '@progress/kendo-angular-icons';
import { saveIcon } from '@progress/kendo-svg-icons';
import { ChangeProfileName } from '@wbs/main/actions';
import { AuthState } from '@wbs/main/states';

@Component({
  standalone: true,
  templateUrl: './profile-editor.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgbModalModule, SVGIconModule, TranslateModule],
})
export class ProfileEditorComponent {
  readonly profile = toSignal(this.store.select(AuthState.profile));
  readonly saveIcon = saveIcon;

  constructor(readonly modal: NgbActiveModal, private readonly store: Store) {}

  changeName(name: string): void {
    if ((name ?? '').trim().length === 0) return;

    this.store.dispatch(new ChangeProfileName(name));
    this.modal.dismiss();
  }
}
