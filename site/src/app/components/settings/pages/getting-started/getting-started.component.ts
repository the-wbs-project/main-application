import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from '@angular/core';
import { faCircle } from '@fortawesome/pro-solid-svg-icons';
import { ORG_SETTINGS_MENU_ITEMS } from 'src/environments/menu-items.const';

@Component({
  templateUrl: './getting-started.component.html',
  styleUrls: ['./getting-started.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class GettingStartedComponent {
  readonly items = ORG_SETTINGS_MENU_ITEMS.slice(1);
  readonly faCircle = faCircle;
}
