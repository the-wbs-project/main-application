import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faCheck } from '@fortawesome/pro-solid-svg-icons';
import { NgbAlertModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  standalone: true,
  selector: 'wbs-saved-alert',
  template: `<ngb-alert
    type="saved"
    [animation]="animation()"
    [dismissible]="dismissible()"
    (closed)="closed.emit()"
  >
    <div class="d-flex flex-align-center w-100">
      <div style="min-width: 40px;" class="tx-16">
        <fa-icon [icon]="check" />
      </div>
      <div class="flex-fill">
        {{ message() | translate }}
      </div>
    </div>
  </ngb-alert>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgbAlertModule, FontAwesomeModule, TranslateModule],
})
export class SavedAlertComponent {
  readonly message = input.required<string>();
  readonly animation = input<boolean>(true);
  readonly dismissible = input<boolean>(true);
  readonly closed = output<void>();
  readonly check = faCheck;
}
