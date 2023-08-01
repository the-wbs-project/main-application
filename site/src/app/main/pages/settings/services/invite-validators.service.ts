import { Injectable } from '@angular/core';
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { Store } from '@ngxs/store';
import { UserAdminState } from '../states';

@Injectable()
export class InviteValidators {
  constructor(private store: Store) {}

  alreadyUser(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const required = control.errors?.['required'];
      const email = control.errors?.['email'];

      if (required || email) return null;
      const value = control.value?.toLowerCase();
      const users = this.store.selectSnapshot(UserAdminState.users)!;

      return users.some((x) => x.email.toLowerCase() === value)
        ? { userFound: true }
        : null;
    };
  }

  alreadyInvite(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const required = control.errors?.['required'];
      const email = control.errors?.['email'];

      if (required || email) return null;

      const value = control.value?.toLowerCase();
      const invites = this.store.selectSnapshot(UserAdminState.invites)!;

      return invites.some((x) => x.email.toLowerCase() === value)
        ? { inviteFound: true }
        : null;
    };
  }

  atleastOneRole(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const val = control.getRawValue();
      const anyRoles = val.pm || val.approver || val.sme || val.admin;

      return anyRoles ? null : { atleastOneRole: true };
    };
  }
}
