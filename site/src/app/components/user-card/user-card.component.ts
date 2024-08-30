import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { UserViewModel } from '@wbs/core/view-models';
import { UserInfoComponent } from '../user-info';

@Component({
  standalone: true,
  selector: 'wbs-user-card',
  templateUrl: './user-card.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgClass, TranslateModule, UserInfoComponent],
})
export class UserCardComponent {
  readonly user = input<UserViewModel>();
  readonly cardHeader = input.required<string>();
  readonly cardClass = input<string | string[]>();
  readonly cardHeaderClass = input<string | string[]>();
  readonly cardBodyClass = input<string | string[]>();
}
