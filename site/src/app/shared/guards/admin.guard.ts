import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { Store } from '@ngxs/store';
import { AuthState } from '@wbs/core/states';

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(private readonly store: Store) {}

  canActivate(): boolean {
    return this.store.selectSnapshot(AuthState.isAdmin);
  }
}
