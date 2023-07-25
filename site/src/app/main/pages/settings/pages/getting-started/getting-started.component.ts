import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from '@angular/core';
import { RouterModule } from '@angular/router';
import { faCircle } from '@fortawesome/pro-solid-svg-icons';
import { TranslateModule } from '@ngx-translate/core';
import { ORG_SETTINGS_MENU_ITEMS } from 'src/environments/menu-items.const';

@Component({
  standalone: true,
  templateUrl: './getting-started.component.html',
  styleUrls: ['./getting-started.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [CommonModule, RouterModule, TranslateModule]
})
export class GettingStartedComponent {
  readonly items = ORG_SETTINGS_MENU_ITEMS.slice(1);
  readonly faCircle = faCircle;
}
