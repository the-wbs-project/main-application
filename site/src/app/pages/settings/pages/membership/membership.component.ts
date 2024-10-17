import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  input,
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
  InvitationDialogComponent,
  InvitationListComponent,
  MemberListComponent,
  MemberListSwitchComponent,
  MembershipRollupComponent,
  RoleFilterListComponent,
} from './components';
import { MembershipSettingStore } from './services';

@Component({
  standalone: true,
  templateUrl: './membership.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ButtonModule,
    DialogModule,
    FontAwesomeModule,
    FormsModule,
    InvitationDialogComponent,
    InvitationListComponent,
    MemberListComponent,
    MemberListSwitchComponent,
    MembershipRollupComponent,
    RoleFilterListComponent,
    TextBoxModule,
    TranslateModule,
  ],
})
export class MembershipComponent {
  private readonly dialog = inject(DialogService);
  private readonly title = inject(TitleService);

  readonly store = inject(MembershipSettingStore);
  readonly roleFilters = signal<string[]>([]);
  readonly view = input.required<'users' | 'invites'>();
  readonly faPlus = faPlus;
  readonly faSpinner = faSpinner;

  textFilter = '';

  constructor() {
    effect(() => this.store.initialize(), {
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
    InvitationDialogComponent.launch(
      this.dialog,
      this.store.invites() ?? [],
      this.store.members() ?? []
    );
  }
}
