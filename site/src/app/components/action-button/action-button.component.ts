import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  output,
} from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faBars } from '@fortawesome/pro-solid-svg-icons';
import { TranslateModule } from '@ngx-translate/core';
import { Navigate } from '@ngxs/router-plugin';
import { Store } from '@ngxs/store';
import { ButtonModule } from '@progress/kendo-angular-buttons';
import { ContextMenuModule } from '@progress/kendo-angular-menu';
import { ActionButtonMenuItem } from '@wbs/core/models';

@Component({
  standalone: true,
  selector: 'wbs-action-button',
  templateUrl: './action-button.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ButtonModule,
    FontAwesomeModule,
    ContextMenuModule,
    TranslateModule,
  ],
})
export class ActionButtonComponent {
  private readonly store = inject(Store);

  readonly menuIcon = faBars;
  readonly customContent = input(false);
  readonly menu = input.required<ActionButtonMenuItem[] | undefined>();
  readonly itemClicked = output<string>();

  selected(item: ActionButtonMenuItem): void {
    if (item.route) {
      this.store.dispatch(new Navigate(item.route));
    } else if (item.action) {
      this.itemClicked.emit(item.action);
    }
  }
}
