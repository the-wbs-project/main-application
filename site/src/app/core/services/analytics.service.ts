import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { StartupService } from '@app/services';
import { ApplicationInsights } from '@microsoft/applicationinsights-web';

@Injectable({ providedIn: 'root' })
export class AnalyticsService {
  constructor(startup: StartupService) {
    if (startup?.user?.id) {
      this.appInsights.setAuthenticatedUserContext(
        startup.user.id,
        undefined,
        true
      );

      var telemetryInitializer = (envelope: any) => {
        envelope.tags['user.id'] = startup?.user?.id;
        envelope.tags['user.fullName'] = startup?.user?.fullName;
        envelope.tags['user.email'] = startup?.user?.email;
        //envelope.tags['user.role'] = startup?.user?.appInfo?.role;
        envelope.tags['url'] = window.location.href;
      };
      this.appInsights.addTelemetryInitializer(telemetryInitializer);
    }
  }

  private get appInsights(): ApplicationInsights {
    //@ts-ignore
    return window.appInsights;
  }

  trackErrorResponse(response: HttpErrorResponse, properties: any) {
    var error = new Error(response.message);
    properties['response'] = JSON.stringify(response);

    this.appInsights.trackException({
      exception: error,
      properties: properties,
    });
    this.appInsights.flush();
  }
}
