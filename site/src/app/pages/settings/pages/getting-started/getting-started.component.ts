import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { faCircle } from '@fortawesome/pro-solid-svg-icons';
import { TranslateModule } from '@ngx-translate/core';
import { map } from 'rxjs/operators';
import { ORG_SETTINGS_MENU_ITEMS } from 'src/environments/menu-items.const';

@Component({
  standalone: true,
  templateUrl: './getting-started.component.html',
  styleUrls: ['./getting-started.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [CommonModule, RouterModule, TranslateModule],
})
export class GettingStartedComponent {
  readonly items = ORG_SETTINGS_MENU_ITEMS.slice(1);
  readonly org = toSignal(this.route.data.pipe(map((d) => <string>d['org'])));
  readonly faCircle = faCircle;

  constructor(private readonly route: ActivatedRoute) {
  }
}
