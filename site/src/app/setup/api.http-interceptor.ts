import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse,
} from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { APP_CONFIG_TOKEN, AppConfiguration } from '@wbs/core/models';
import { Observable, of } from 'rxjs';

@Injectable()
export class ApiRequestInterceptor implements HttpInterceptor {
  private readonly appConfig: AppConfiguration = inject(APP_CONFIG_TOKEN);

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    if (request.url === 'uploadSaveUrl')
      return of(new HttpResponse({ status: 200 }));

    if (request.url.indexOf('api/') === 0) {
      request = request.clone({
        url: `${this.appConfig.api_domain}/${request.url}`,
      });
    }
    return next.handle(request);
  }
}
