import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { Store } from '@ngxs/store';
import { DataServiceFactory } from '@wbs/shared/services';
import { Observable, of } from 'rxjs';

@Injectable()
export class ProjectManageResolver implements Resolve<any> {
  constructor(store: Store, private readonly data: DataServiceFactory) {}

  resolve(route: ActivatedRouteSnapshot): Observable<any> {
    const projectId = <string>route.paramMap.get('projectId');

    return of();
  }
}
