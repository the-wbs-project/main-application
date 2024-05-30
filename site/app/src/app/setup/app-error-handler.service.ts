import { ErrorHandler, Injectable, Injector } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { ErrorService } from '@wbs/core/services/error.service';
import { Logger } from '@wbs/core/services/logger.service';
import { Messages } from '@wbs/core/services/messages.service';

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
  // Error handling is important and needs to be loaded first.
  // Because of this we should manually inject the services with Injector.
  constructor(private injector: Injector) {}

  handleError(error: Error | HttpErrorResponse) {
    const errorService = this.injector.get(ErrorService);
    const logger = this.injector.get(Logger);
    const notifier = this.injector.get(Messages);

    let kind;
    let message;
    let stack;

    if (error instanceof HttpErrorResponse) {
      if (error.status === 401) return;
      if (error.status === 404) return;

      // Server Error
      kind = error.name;
      message = errorService.getServerMessage(error);
      stack = errorService.getServerStack(error);
    } else {
      // Client Error
      kind = error.name;
      message = errorService.getClientMessage(error);
      stack = errorService.getClientStack(error);
    }

    logger.error(message, {
      name: 'Http Error Response',
      error: {
        kind,
        message,
        stack,
        exception: error,
      },
    });

    notifier.notify.error(
      'An unexpected error has occured and been sent to our team.',
      false
    );

    console.error(error);
  }
}
