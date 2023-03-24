import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApplicationInsights } from '@microsoft/applicationinsights-web';
import { Store } from '@ngxs/store';
import { AuthState } from '../states';

@Injectable({ providedIn: 'root' })
export class AnalyticsService {
  private static appInsights?: ApplicationInsights;
  private isUserSet = false;

  constructor(private readonly store: Store) {}

  private get appInsights(): ApplicationInsights {
    return AnalyticsService.appInsights!;
  }

  static setup(): void {
    this.appInsights = new ApplicationInsights({
      config: {
        instrumentationKey: JSON.parse(
          document.getElementById('app_insights')!.innerHTML
        ),
        samplingPercentage: 100,
      },
    });
    this.appInsights.loadAppInsights();
    this.appInsights.trackPageView();
  }

  trackErrorResponse(response: HttpErrorResponse, properties: any) {
    if (!this.isUserSet) this.setUser();

    var error = new Error(response.message);
    properties['response'] = JSON.stringify(response);

    this.appInsights.trackException({
      exception: error,
      properties: properties,
    });
    this.appInsights.flush();
  }

  private setUser(): void {
    const user = this.store.selectSnapshot(AuthState.profile);

    if (!user) return;

    var telemetryInitializer = (envelope: any) => {
      envelope.tags['user.id'] = user.id;
      envelope.tags['user.fullName'] = user.name;
      envelope.tags['user.email'] = user.email;
      //envelope.tags['user.role'] = startup?.user?.appInfo?.role;
      //envelope.tags['url'] = window.location.href;
    };

    console.log(this.appInsights);
    //this.appInsights.setAuthenticatedUserContext(user.id, undefined, true);
    //this.appInsights.addTelemetryInitializer(telemetryInitializer);
    this.isUserSet = true;
  }
}
