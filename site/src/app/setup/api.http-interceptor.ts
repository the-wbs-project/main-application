import {
  HttpEvent,
  HttpHandlerFn,
  HttpRequest,
  HttpResponse,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { APP_CONFIG_TOKEN, AppConfiguration } from '@wbs/core/models';
import { Observable, of } from 'rxjs';

export function apiRequestInterceptor(
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> {
  const appConfig: AppConfiguration = inject(APP_CONFIG_TOKEN);

  if (req.url === 'uploadSaveUrl') return of(new HttpResponse({ status: 200 }));

  if (req.url.indexOf('api/') === 0) {
    req = req.clone({
      url: `${appConfig.api_domain}/${req.url}`,
    });
  }
  return next(req);
}
