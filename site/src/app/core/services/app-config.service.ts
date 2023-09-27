import { Injectable } from '@angular/core';
import { AuthConfig } from '@auth0/auth0-angular';
import { LogsInitConfiguration } from '@datadog/browser-logs';

@Injectable({ providedIn: 'root' })
export class AppConfig {
  readonly apiDomain: string;
  readonly authClientId: string;
  readonly datadogEnv: string;
  readonly authConfig: AuthConfig;
  readonly datadogConfig: LogsInitConfiguration;
  readonly datadogContext = {
    app: 'pm-empower',
    host: window.location.host,
  };

  constructor() {
    const config = JSON.parse(
      document.getElementById('edge_config')!.innerHTML
    );

    this.apiDomain = config['api_prefix'];
    this.authClientId = config['auth_clientId'];
    this.datadogEnv = config['datadog_env'];

    this.authConfig = {
      domain: 'auth.pm-empower.com',
      clientId: this.authClientId,
      authorizationParams: {
        connection: 'Username-Password-Authentication',
        audience: 'https://pm-empower.us.auth0.com/api/v2/',
        redirect_uri: `${window.location.protocol}//${window.location.host}`,
      },
      // The AuthHttpInterceptor configuration
      httpInterceptor: {
        allowedList: [
          {
            uri: this.apiDomain + '/resources/*',
            allowAnonymous: true,
          },
          {
            uri: this.apiDomain + '/lists/*',
            allowAnonymous: true,
          },
          this.apiDomain + '/*',
        ],
      },
    };

    this.datadogConfig = {
      clientToken: 'pubd0e9b67a9b76d45b8156a8ce603286d7',
      site: 'us5.datadoghq.com',
      service: 'pm-empower-site',
      env: this.datadogEnv,
      forwardErrorsToLogs: true,
      sessionSampleRate: 100,
      beforeSend: (log) => {
        //
        //  Don't send dev server errors
        //
        if ((log.message ?? '').indexOf('[webpack-dev-server]') > -1) {
          return false;
        }

        return;
      },
    };
  }
}
