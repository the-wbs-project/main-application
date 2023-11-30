import { Injectable } from '@angular/core';
import { Store } from '@ngxs/store';
import { Invite, Member, Role } from '@wbs/core/models';
import { Messages } from '@wbs/core/services';
import { InviteViewModel, MemberViewModel } from '@wbs/core/view-models';
import { DialogService } from '@wbs/main/services';
import { AuthState } from '@wbs/main/states';
import { Observable, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { MembershipAdminService } from './membership-admin.service';
import { EditMemberComponent } from '../components/edit-member/edit-member.component';
import { InvitesFormComponent } from '../components/invites-form/invites-form.component';

@Injectable()
export class MembershipAdminUiService {
  constructor(
    private readonly dialogService: DialogService,
    private readonly service: MembershipAdminService,
    private readonly messages: Messages,
    private readonly store: Store
  ) {}

  openEditMemberDialog(
    org: string,
    member: MemberViewModel,
    roles: Role[]
  ): Observable<MemberViewModel | undefined> {
    return this.dialogService
      .openDialog<MemberViewModel>(
        EditMemberComponent,
        {
          size: 'lg',
        },
        { member, roles }
      )
      .pipe(
        switchMap((changedMember) => {
          if (!changedMember) return of(undefined);

          const toRemove = changedMember.roles.filter(
            (r) => !member.roles.includes(r)
          );
          const toAdd = member.roles.filter(
            (r) => !changedMember.roles.includes(r)
          );

          changedMember.roleList = changedMember.roles.join(',');

          return this.service
            .updateMemberRolesAsync(org, changedMember, toAdd, toRemove)
            .pipe(map(() => changedMember));
        })
      );
  }

  openRemoveMemberDialog(org: string, memberId: string): Observable<boolean> {
    return this.messages.confirm
      .show('General.Confirmation', 'OrgSettings.MemberRemoveConfirm')
      .pipe(
        switchMap((answer) => {
          if (!answer) return of(false);

          return this.service
            .removeMemberAsync(org, memberId)
            .pipe(map(() => true));
        })
      );
  }

  openNewInviteDialog(
    org: string,
    invites: Invite[],
    members: Member[],
    roles: Role[]
  ): Observable<Invite[] | undefined> {
    return this.dialogService
      .openDialog<{ emails: string[]; roles: string[] } | undefined>(
        InvitesFormComponent,
        {
          size: 'lg',
        },
        { invites, members, roles }
      )
      .pipe(
        switchMap((data) =>
          data
            ? this.service.sendInvitesAsync(
                org,
                data.emails,
                data.roles,
                this.getName()
              )
            : of(undefined)
        )
      );
  }

  openCancelInviteDialog(org: string, inviteId: string): Observable<boolean> {
    return this.messages.confirm
      .show('General.Confirmation', 'OrgSettings.CancelInviteConfirm')
      .pipe(
        switchMap((answer) => {
          if (!answer) return of(false);

          return this.service
            .cancelInviteAsync(org, inviteId)
            .pipe(map(() => true));
        })
      );
  }

  private getName(): string {
    return this.store.selectSnapshot(AuthState.profile)!.name;
  }
}
