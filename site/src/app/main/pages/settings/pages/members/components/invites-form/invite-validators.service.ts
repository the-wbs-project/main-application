import { Injectable } from '@angular/core';
import { Store } from '@ngxs/store';
import { MembershipState } from '@wbs/main/states';

@Injectable()
export class InviteValidators {
  constructor(private store: Store) {}

  checkIfAnyExists(emails: string[]): string[] {
    const existing: string[] = [];
    const users = this.store.selectSnapshot(MembershipState.members)!;

    for (const email of emails) {
      if (users.some((x) => x.email.toLowerCase() === email.toLowerCase())) {
        existing.push(email);
      }
    }
    return existing;
  }

  checkIfAnyInvited(emails: string[]): string[] {
    const existing: string[] = [];
    const invitations = this.store.selectSnapshot(MembershipState.invitations)!;

    for (const email of emails) {
      if (
        invitations.some((x) => x.invitee.toLowerCase() === email.toLowerCase())
      ) {
        existing.push(email);
      }
    }
    return existing;
  }
}
