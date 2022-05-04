import { Injectable } from '@angular/core';
import { CanActivate, UrlTree } from '@angular/router';
import { SCRIPT_LOADER_RESULTS, SCRIPT_STORE } from '@wbs/shared/models';
import { ScriptService } from '@wbs/shared/services';
import { map, Observable, of, switchMap, timer } from 'rxjs';

@Injectable()
export class ScriptGuard implements CanActivate {
  constructor(private readonly scripts: ScriptService) {}

  canActivate(): Observable<boolean | UrlTree> {
    return this.scripts.loadScript(SCRIPT_STORE.XLSX_MINI).pipe(
      switchMap((results) =>
        results === SCRIPT_LOADER_RESULTS.LOADED ? timer(500) : of()
      ),
      map(() => true)
    );
  }
}
