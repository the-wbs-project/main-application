import { Injectable } from '@angular/core';
import {
  SCRIPT_LOADER_RESULTS,
  SCRIPT_LOADER_RESULTS_TYPE,
} from '@wbs/shared/models';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ScriptService {
  private loadedScripts: string[] = [];

  loadScript(scriptUrl: string): Observable<SCRIPT_LOADER_RESULTS_TYPE> {
    return new Observable<SCRIPT_LOADER_RESULTS_TYPE>((observer) => {
      // resolve if already loaded
      if (this.loadedScripts.indexOf(scriptUrl) > -1) {
        observer.next(SCRIPT_LOADER_RESULTS.ALREADY_LOADED);
        observer.complete();
      } else {
        // load script
        const script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = scriptUrl;
        script.onload = () => {
          this.loadedScripts.push(scriptUrl);
          observer.next(SCRIPT_LOADER_RESULTS.LOADED);
          observer.complete();
        };
        script.onerror = () => {
          observer.next(SCRIPT_LOADER_RESULTS.FAILED);
          observer.complete();
        };
        document.getElementsByTagName('head')[0].appendChild(script);
      }
    });
  }
}
