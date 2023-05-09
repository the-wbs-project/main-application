import { Injectable } from '@angular/core';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { SetHeaderInfo } from '../actions';
import { HeaderInformation } from '../models';

@Injectable({ providedIn: 'root' })
export class HeaderService {
  constructor(private readonly store: Store) {}

  headerGuard(info: HeaderInformation): Observable<boolean> {
    return this.store.dispatch(new SetHeaderInfo(info)).pipe(map(() => true));
  }
}
