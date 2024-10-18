import {
  ChangeDetectionStrategy,
  Component,
  inject,
  model,
} from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import {
  ButtonGroupModule,
  ButtonModule,
} from '@progress/kendo-angular-buttons';
import { NavigationService } from '@wbs/core/services';
import { MembershipStore } from '@wbs/core/store';

@Component({
  standalone: true,
  selector: 'wbs-member-list-switch',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ButtonGroupModule, ButtonModule, TranslateModule],
  template: `<kendo-buttongroup selection="single">
    @for (option of options; track option.value) {
    <button
      kendoButton
      size="small"
      [selected]="view() === option.value"
      (click)="nav(option.value)"
    >
      {{ option.text | translate }}
    </button>
    }
  </kendo-buttongroup> `,
})
export class MemberListSwitchComponent {
  private readonly navigate = inject(NavigationService);
  private readonly membershipStore = inject(MembershipStore);

  readonly view = model.required<'users' | 'invites'>();
  readonly options = [
    { text: 'General.Users', value: 'users' },
    { text: 'OrgSettings.Invitations', value: 'invites' },
  ];

  nav(view: string) {
    const org = this.membershipStore.membership()!.id;

    this.navigate.navigate(['/', org, 'settings', 'membership', view]);
  }
}
