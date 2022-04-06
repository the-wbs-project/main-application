import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { Navigate } from '@ngxs/router-plugin';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class DragGuard implements CanActivate {
  constructor(private readonly store: Store) {}

  canActivate(): Observable<boolean> | boolean {
    return this.store
      .dispatch(new Navigate(['demos', 'drag-and-drop', '123', 'phase']))
      .pipe(map(() => false));
  }
}
