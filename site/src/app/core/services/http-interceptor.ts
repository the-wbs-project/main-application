import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpHeaders,
  HttpInterceptor,
  HttpRequest,
  HttpResponse,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AnalyticsService } from './analytics.service';
import { Messages } from './messages.service';

const noErrorUrls = ['logger/activity', 'logger/activities'];

@Injectable()
export class RequestInterceptor implements HttpInterceptor {
  constructor(
    private readonly analytics: AnalyticsService,
    private readonly messages: Messages
  ) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    if (request.url === 'uploadSaveUrl')
      return of(new HttpResponse({ status: 200 }));

    if (request.url.indexOf('assets') === -1) {
      request = request.clone({
        url: `api/${request.url}`,
      });
    }
    //@ts-ignore
    return next
      .handle(request)
      .pipe(
        catchError((err: HttpErrorResponse) => this.handleError(request, err))
      );
  }

  private handleError(
    request: HttpRequest<any>,
    err: HttpErrorResponse
  ): Observable<void | null> {
    if (err.status === 404) return of(null);
    if (err instanceof HttpErrorResponse) {
      console.error(err);
      let showMessage = !this.isInList(noErrorUrls, request.url);

      if (showMessage) {
        const message =
          err.status === 401
            ? 'General.LoginExpired'
            : 'General.UnexpectedServerError';

        this.messages.error(message, true);
      }

      this.logError(request.url, request.headers, err);
    }
    return throwError(err);
  }

  private isInList(list: string[], url: string) {
    url = url.toLowerCase();

    for (let i = 0; i < list.length; i++) {
      if (url.toLowerCase().indexOf(list[i]) > -1) {
        return true;
      }
    }
    return false;
  }

  private logError(
    url: string,
    reqHeaders: HttpHeaders,
    error: HttpErrorResponse
  ) {
    try {
      const information = {
        error: this.stringifyError(error),
        requestUrl: url,
        reqHeaders: this.headersToString(reqHeaders),
      };
      this.analytics.trackErrorResponse(error, information);
    } catch (e) {}
  }

  private stringifyError(err: Error) {
    if (!err) return null;
    var plainObject: Record<string, string> = {};

    for (const key of Object.getOwnPropertyNames(err)) {
      //@ts-ignore
      plainObject[key] = err[key];
    }
    return JSON.stringify(plainObject);
  }

  private headersToString(headers: HttpHeaders): string | null {
    if (headers == null) return null;
    const results: Record<string, string> = {};

    for (const key of headers.keys()) {
      const val = headers.get(key);
      if (val != null) results[key] = val;
    }
    return JSON.stringify(results);
  }
}
