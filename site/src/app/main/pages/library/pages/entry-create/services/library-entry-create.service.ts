import { Injectable } from '@angular/core';
import { Navigate } from '@ngxs/router-plugin';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { SubmitBasics } from '../actions';
import { LIBRARY_ENTRY_CREATION_PAGES } from '../models';

@Injectable()
export class LibraryEntryCreateService {
  constructor(private store: Store) {}

  nav(org: string, page: string): Observable<void> {
    return this.store.dispatch(
      new Navigate(['/' + org, 'library', 'create', page])
    );
  }

  setBasics(org: string, title: string, type: string): void {
    this.store.dispatch(new SubmitBasics(title.trim(), type));
    this.nav(
      org,
      type === 'project'
        ? LIBRARY_ENTRY_CREATION_PAGES.CATEGORY
        : LIBRARY_ENTRY_CREATION_PAGES.CATEGORIES
    );
  }
}
