import { ActivatedRouteSnapshot } from '@angular/router';
import { Store } from '@ngxs/store';
import { FileInfo } from '@progress/kendo-angular-upload';
import { Observable, of } from 'rxjs';
import { first, map, skipWhile } from 'rxjs/operators';
import { MembershipState } from '../states';

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

  static getFileAsync(file: FileInfo): Observable<ArrayBuffer> {
    return new Observable<ArrayBuffer>((obs) => {
      if (!file) {
        obs.complete();
        return;
      }
      const reader = new FileReader();

      reader.onload = function (ev) {
        const data = ev.target?.result;

        obs.next(<ArrayBuffer>data);
        obs.complete();
      };

      reader.readAsArrayBuffer(file.rawFile!);
      //reader.readAsDataURL(file.rawFile!);
    });
  }
}
