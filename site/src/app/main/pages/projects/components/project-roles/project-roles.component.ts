import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  signal,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { TranslateModule } from '@ngx-translate/core';
import { Store } from '@ngxs/store';
import { minusIcon, plusIcon } from '@progress/kendo-svg-icons';
import { Member } from '@wbs/core/models';
import { Messages, Resources } from '@wbs/core/services';
import { RoleState } from '@wbs/main/states';
import { ProjectUserListComponent } from '../user-list/user-list.component';
import { RoleUsersService } from './services';
import { RoleUsersViewModel } from './view-models';

declare type OutputType = {
  user: Member;
  role: string;
};

@Component({
  standalone: true,
  selector: 'wbs-project-roles',
  templateUrl: './project-roles.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ProjectUserListComponent, TranslateModule],
  providers: [RoleUsersService],
})
export class ProjectRolesComponent implements OnChanges {
  @Input() mustConfirm = false;
  @Input() members?: Member[];
  @Input() approverIds?: string[];
  @Input() pmIds?: string[];
  @Input() smeIds?: string[];
  @Input({ required: true }) approvalEnabled!: boolean;
  @Output() readonly addUserToRole = new EventEmitter<OutputType>();
  @Output() readonly removeUserToRole = new EventEmitter<OutputType>();

  readonly roles = toSignal(this.store.select(RoleState.ids));
  readonly approvers = signal<RoleUsersViewModel>({
    assigned: [],
    unassigned: [],
  });
  readonly pms = signal<RoleUsersViewModel>({
    assigned: [],
    unassigned: [],
  });
  readonly smes = signal<RoleUsersViewModel>({
    assigned: [],
    unassigned: [],
  });

  readonly minusIcon = minusIcon;
  readonly plusIcon = plusIcon;

  constructor(
    private readonly messages: Messages,
    private readonly resources: Resources,
    private readonly service: RoleUsersService,
    private readonly store: Store
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (!this.members) return;

    const keys = Object.keys(changes);
    const ids = this.store.selectSnapshot(RoleState.ids)!;

    if (keys.includes('approverIds') && this.approverIds) {
      this.approvers.set(
        this.service.get(ids.approver, this.approverIds, this.members)
      );
    }
    if (keys.includes('pmIds') && this.pmIds) {
      this.pms.set(this.service.get(ids.pm, this.pmIds, this.members));
    }
    if (keys.includes('smeIds') && this.smeIds) {
      this.smes.set(this.service.get(ids.sme, this.smeIds, this.members));
    }
  }

  add(role: string, user: Member) {
    this.run(
      role,
      user,
      'ProjectSettings.AddUserConfirmation',
      this.addUserToRole
    );
  }

  remove(role: string, user: Member) {
    this.run(
      role,
      user,
      'ProjectSettings.RemoveUserConfirmation',
      this.removeUserToRole
    );
  }

  private run(
    role: string,
    user: Member,
    message: string,
    output: EventEmitter<OutputType>
  ): void {
    if (!this.mustConfirm) {
      output.emit({ user, role });
      return;
    }
    const roleTitle = this.resources.get(
      this.store
        .selectSnapshot(RoleState.definitions)
        .find((x) => x.id === role)!.description
    );

    this.messages.confirm
      .show('General.Confirmation', message, {
        ROLE_NAME: roleTitle,
        USER_NAME: user.name,
      })
      .subscribe((answer) => {
        if (answer) output.emit({ user, role });
      });
  }
}
