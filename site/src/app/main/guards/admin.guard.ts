import { inject, Injectable } from '@angular/core';
import { Store } from '@ngxs/store';
import { AuthState } from '@wbs/core/states';
import { Observable } from 'rxjs';

@Injectable()
export class AdminGuard {
  private readonly store = inject(Store);

  canActivate(): Observable<boolean> {
    return this.store.selectOnce(AuthState.isAdmin);
  }
}
