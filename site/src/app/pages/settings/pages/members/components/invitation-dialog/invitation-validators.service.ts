import { Injectable } from '@angular/core';
import { Invite, User } from '@wbs/core/models';

@Injectable()
export class InvitationValidators {
  checkIfAnyInvalid(emails: string[]): string[] {
    const invalid: string[] = [];

    for (const email of emails) {
      if (!this.isValid(email)) {
        invalid.push(email);
      }
    }
    return invalid;
  }

  checkIfAnyExists(members: User[], emails: string[]): string[] {
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
      if (invites.some((x) => x.email.toLowerCase() === email.toLowerCase())) {
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
