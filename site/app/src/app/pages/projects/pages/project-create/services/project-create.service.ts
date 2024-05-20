import { Injectable } from '@angular/core';
import { Navigate } from '@ngxs/router-plugin';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';

@Injectable()
export class ProjectCreateService {
  constructor(private store: Store) {}

  nav(org: string, page: string): Observable<void> {
    return this.store.dispatch(
      new Navigate(['/' + org, 'projects', 'create', page])
    );
  }
}
