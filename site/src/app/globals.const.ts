import { AuthConfig } from '@auth0/auth0-angular';
import { LogsInitConfiguration } from '@datadog/browser-logs';
import { environment } from 'src/environments/environment';

export const AUTH_CONFIG: AuthConfig = {
  domain: 'pm-empower.us.auth0.com',
  clientId: environment.auth_clientId,
  authorizationParams: {
    connection: 'Username-Password-Authentication',
    audience: 'https://pm-empower.us.auth0.com/api/v2/',
    redirect_uri: `${window.location.protocol}//${window.location.host}`,
  },
  // The AuthHttpInterceptor configuration
  httpInterceptor: {
    allowedList: [
      {
        uri: environment.apiPrefix + 'resources/*',
        allowAnonymous: true,
      },
      {
        uri: environment.apiPrefix + 'lists/*',
        allowAnonymous: true,
      },
      environment.apiPrefix + '*',
    ],
  },
};

export const DATADOG_CONFIG: LogsInitConfiguration = {
  clientToken: 'pubd0e9b67a9b76d45b8156a8ce603286d7',
  site: 'us5.datadoghq.com',
  service: 'pm-empower-site',
  env: environment.datadog_env,
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

export const DATADOG_CONTEXT = {
  app: 'pm-empower',
  host: window.location.host,
};
