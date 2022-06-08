import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { StartWizard } from '../project-create.actions';

@Injectable()
export class StartCreationGuard implements CanActivate {
  constructor(private readonly store: Store) {}

  canActivate(): Observable<boolean> | boolean {
    return this.store.dispatch(new StartWizard()).pipe(map(() => true));
  }
}