import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faSpinner } from '@fortawesome/pro-duotone-svg-icons';
import { faPlus } from '@fortawesome/pro-solid-svg-icons';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonModule } from '@progress/kendo-angular-buttons';
import { DialogModule, DialogService } from '@progress/kendo-angular-dialog';
import { TextBoxModule } from '@progress/kendo-angular-inputs';
import { TitleService } from '@wbs/core/services';
import {
  MembershipStore,
  MetadataStore,
  UiStore,
  UserStore,
} from '@wbs/core/store';
import {
  InvitationFormComponent,
  InvitationListComponent,
  MemberListComponent,
  MemberListSwitchComponent,
  MembershipRollupComponent,
  RoleFilterListComponent,
} from './components';
import { MemberSettingsService } from './services';
import { MembersSettingStore } from './store';

@Component({
  standalone: true,
  templateUrl: './members.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ButtonModule,
    DialogModule,
    FontAwesomeModule,
    FormsModule,
    InvitationFormComponent,
    InvitationListComponent,
    MemberListComponent,
    MemberListSwitchComponent,
    MembershipRollupComponent,
    RoleFilterListComponent,
    TextBoxModule,
    TranslateModule,
  ],
})
export class MembersComponent {
  private readonly dialog = inject(DialogService);
  private readonly memberService = inject(MemberSettingsService);
  private readonly metadata = inject(MetadataStore);
  private readonly title = inject(TitleService);
  private readonly uiStore = inject(UiStore);
  private readonly profile = inject(UserStore).profile;

  readonly membership = inject(MembershipStore).membership;
  readonly store = inject(MembersSettingStore);
  readonly roleFilters = signal<string[]>([]);
  readonly view = signal<'members' | 'invites'>('members');
  readonly faPlus = faPlus;
  readonly faSpinner = faSpinner;

  textFilter = '';

  constructor() {
    effect(() => this.store.initialize(this.membership()), {
      allowSignalWrites: true,
    });

    /* this.uiStore.setBreadcrumbs([
      { text: 'General.Settings' },
      { text: 'General.Members' },
    ]);*/
    this.title.setTitle([
      { text: 'General.Settings' },
      { text: 'General.Members' },
    ]);
  }

  startInvite(): void {
    InvitationFormComponent.launchAsync(
      this.dialog,
      this.store.invites() ?? [],
      this.store.members() ?? [],
      this.metadata.roles.definitions
    ).subscribe((results) => {
      if (!results) return;

      const name = this.profile()!.name;

      this.memberService.sendInvitesAsync(results.emails, results.roles, name);
    });
  }
}
