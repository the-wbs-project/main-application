import { ErrorHandler, Injectable } from '@angular/core';
import { AnalyticsService } from './analytics.service';

@Injectable({
  providedIn: 'root',
})
export class MyErrorHandler implements ErrorHandler {
  constructor(private readonly logger: AnalyticsService) {}

  handleError(error: any): void {
    console.log(error);

    this.logger.error(error);
  }
}
