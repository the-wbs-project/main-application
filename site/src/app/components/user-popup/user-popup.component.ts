import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { TranslateModule } from '@ngx-translate/core';
import { PopupModule } from '@progress/kendo-angular-popup';

@Component({
  standalone: true,
  selector: 'wbs-user-popup',
  templateUrl: './user-popup.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FontAwesomeModule, PopupModule, TranslateModule],
})
export class UserPopupComponent {}
