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
import { TranslateModule } from '@ngx-translate/core';
import { minusIcon, plusIcon } from '@progress/kendo-svg-icons';
import { Member, ROLES, ROLES_CONST, ROLES_TYPE } from '@wbs/core/models';
import { ProjectService } from '@wbs/core/services';
import { DialogService } from '@wbs/main/services';
import { ProjectUserListComponent } from '../user-list/user-list.component';
import { RoleUsersService } from './services';
import { RoleUsersViewModel } from './view-models/role-users.view-model';

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
  providers: [DialogService, RoleUsersService],
})
export class ProjectRolesComponent implements OnChanges {
  @Input() mustConfirm = false;
  @Input() members?: Member[];
  @Input() approverIds?: string[];
  @Input() pmIds?: string[];
  @Input() smeIds?: string[];
  @Output() readonly addUserToRole = new EventEmitter<OutputType>();
  @Output() readonly removeUserToRole = new EventEmitter<OutputType>();

  readonly approvers = signal(<RoleUsersViewModel>{});
  readonly pms = signal(<RoleUsersViewModel>{});
  readonly smes = signal(<RoleUsersViewModel>{});

  readonly minusIcon = minusIcon;
  readonly plusIcon = plusIcon;
  readonly roles = ROLES_CONST;

  constructor(
    private readonly dialog: DialogService,
    private readonly projectService: ProjectService,
    private readonly service: RoleUsersService
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (!this.members) return;

    const keys = Object.keys(changes);

    if (keys.includes('approverIds') && this.approverIds) {
      this.approvers.set(
        this.service.get(ROLES.APPROVER, this.approverIds, this.members)
      );
    }
    if (keys.includes('pmIds') && this.pmIds) {
      this.pms.set(this.service.get(ROLES.PM, this.pmIds, this.members));
    }
    if (keys.includes('smeIds') && this.smeIds) {
      this.smes.set(this.service.get(ROLES.SME, this.smeIds, this.members));
    }
  }

  add(role: ROLES_TYPE, user: Member) {
    this.run(
      role,
      user,
      'ProjectSettings.AddUserConfirmation',
      this.addUserToRole
    );
  }

  remove(role: ROLES_TYPE, user: Member) {
    this.run(
      role,
      user,
      'ProjectSettings.RemoveUserConfirmation',
      this.removeUserToRole
    );
  }

  private run(
    role: ROLES_TYPE,
    user: Member,
    message: string,
    output: EventEmitter<OutputType>
  ): void {
    if (!this.mustConfirm) {
      output.emit({ user, role });
      return;
    }
    const roleTitle = this.projectService.getRoleTitle(role, false);

    this.dialog
      .confirm('General.Confirmation', message, {
        ROLE_NAME: roleTitle,
        USER_NAME: user.name,
      })
      .subscribe((answer) => {
        if (answer) output.emit({ user, role });
      });
  }
}
