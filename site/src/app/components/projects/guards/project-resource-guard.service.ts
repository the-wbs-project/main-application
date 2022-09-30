import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { Resources } from '@wbs/shared/services';
import { forkJoin, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class ProjectResourceGuard implements CanActivate {
  constructor(private readonly resources: Resources) {}

  canActivate(): Observable<boolean> {
    return forkJoin([
      this.resources.verifyAsync('Wbs'),
      this.resources.verifyAsync('Projects'),
      this.resources.verifyAsync('Actions'),
    ]).pipe(map(() => true));
  }
}
