import { Injectable } from '@angular/core';
import { Store } from '@ngxs/store';
import { MembershipAdminState } from '../../states';

@Injectable()
export class InviteValidators {
  constructor(private store: Store) {}

  checkIfAnyInvalid(emails: string[]): string[] {
    const invalid: string[] = [];

    for (const email of emails) {
      if (!this.isValid(email)) {
        invalid.push(email);
      }
    }
    return invalid;
  }

  checkIfAnyExists(emails: string[]): string[] {
    const existing: string[] = [];
    const users = this.store.selectSnapshot(MembershipAdminState.members)!;

    for (const email of emails) {
      if (users.some((x) => x.email.toLowerCase() === email.toLowerCase())) {
        existing.push(email);
      }
    }
    return existing;
  }

  checkIfAnyInvited(emails: string[]): string[] {
    const existing: string[] = [];
    const invitations = this.store.selectSnapshot(
      MembershipAdminState.invitations
    )!;

    for (const email of emails) {
      if (
        invitations.some((x) => x.invitee.toLowerCase() === email.toLowerCase())
      ) {
        existing.push(email);
      }
    }
    return existing;
  }

  private isValid(emailAddress: string): boolean {
    const re =
      /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/.test(
        emailAddress
      );

    return re;
  }
}
