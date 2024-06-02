import { AuthConfig } from '@auth0/auth0-angular';

//@ts-ignore
const config = window.appConfig;
const apiDomain = config['api_domain'];
const authClientId = config['auth_clientId'];

export const AUTH_CONFIG: AuthConfig = {
  domain: 'auth.pm-empower.com',
  clientId: authClientId,
  authorizationParams: {
    connection: 'Username-Password-Authentication',
    audience: 'https://pm-empower.us.auth0.com/api/v2/',
    redirect_uri: `${window.location.protocol}//${window.location.host}`,
  },
  // The AuthHttpInterceptor configuration
  httpInterceptor: {
    allowedList: [
      {
        uri: apiDomain + '/api/resources/*',
        allowAnonymous: true,
      },
      {
        uri: apiDomain + '/api/lists/*',
        allowAnonymous: true,
      },
      'https://ai.pm-empower.com/*',
      apiDomain + '/*',
    ],
  },
};
