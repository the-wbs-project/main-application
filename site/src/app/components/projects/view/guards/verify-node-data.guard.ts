import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { Store } from '@ngxs/store';
import { VerifyDeleteReasons } from '@wbs/actions';
import { Resources } from '@wbs/services';
import { forkJoin, Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { ClearEditor } from 'src/app/components/_features';

@Injectable()
export class VerifyNodeDataGuard implements CanActivate {
  constructor(
    private readonly resources: Resources,
    private readonly store: Store
  ) {}

  canActivate(): Observable<boolean> | boolean {
    return forkJoin([
      this.resources.verifyAsync('Wbs'),
      this.store.dispatch(new VerifyDeleteReasons()),
      this.store.dispatch(new ClearEditor()),
    ]).pipe(map(() => true));
  }
}
