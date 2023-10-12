import { ActivatedRouteSnapshot } from '@angular/router';
import { Store } from '@ngxs/store';
import { MembershipState } from '../states';
import { Observable, of } from 'rxjs';
import { first, map, skipWhile } from 'rxjs/operators';

export class Utils {
  static getOrgName(store: Store, route: ActivatedRouteSnapshot): string {
    return (
      route.params['org'] ??
      route.params['owner'] ??
      store.selectSnapshot(MembershipState.organization)?.name
    );
  }

  static getOrgNameAsync(
    store: Store,
    route: ActivatedRouteSnapshot
  ): Observable<string> {
    const id = route.params['org'] ?? route.params['owner'];

    if (id) return of(id);

    return store.select(MembershipState.organization).pipe(
      skipWhile((x) => x == undefined),
      map((x) => x!.name),
      first()
    );
  }
}
