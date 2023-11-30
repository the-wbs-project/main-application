import { Injectable } from '@angular/core';
import { Invite, Member } from '@wbs/core/models';

@Injectable()
export class InviteValidators {
  checkIfAnyInvalid(emails: string[]): string[] {
    const invalid: string[] = [];

    for (const email of emails) {
      if (!this.isValid(email)) {
        invalid.push(email);
      }
    }
    return invalid;
  }

  checkIfAnyExists(members: Member[], emails: string[]): string[] {
    const existing: string[] = [];

    for (const email of emails) {
      if (members.some((x) => x.email.toLowerCase() === email.toLowerCase())) {
        existing.push(email);
      }
    }
    return existing;
  }

  checkIfAnyInvited(invites: Invite[], emails: string[]): string[] {
    const existing: string[] = [];

    for (const email of emails) {
      if (
        invites.some(
          (x) =>
            x.invitee.toLowerCase() === email.toLowerCase() &&
            new Date(x.expiresAt) > new Date()
        )
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
