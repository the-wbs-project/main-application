import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { API_PREFIX } from 'src/environments/app.config';

@Injectable()
export class ApiRequestInterceptor implements HttpInterceptor {
  private readonly apiDomain = API_PREFIX;

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    if (request.url === 'uploadSaveUrl')
      return of(new HttpResponse({ status: 200 }));

    if (request.url.indexOf('api/') === 0) {
      request = request.clone({
        url: `${this.apiDomain}/${request.url}`,
      });
    }
    return next.handle(request);
  }
}
