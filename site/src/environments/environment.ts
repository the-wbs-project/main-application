import { AuthConfig } from '@auth0/auth0-angular';

export const environment = {
  production: true,
  appTitle: 'PM Empower',
  apiPrefix: 'https://api.pm-empower.com/api/',
  appInsightsKey: '44521f2e-90b6-4be0-8659-0c84bfde1907',
  auth: <AuthConfig>{
    domain: 'auth.dev.thewbsproject.com',
    clientId: '1nOKv3soErPVx2nJlfZFZdIqYkjUnMkX',
    authorizationParams: {
      audience: 'https://dev-3lcexa83.us.auth0.com/api/v2/',
      redirect_uri: `${window.location.protocol}//${window.location.host}`,
    },
    // The AuthHttpInterceptor configuration
    httpInterceptor: {
      allowedList: [
        {
          uri: 'https://api.pm-empower.com/api/resources/*',
          allowAnonymous: true,
        },
        {
          uri: 'https://api.pm-empower.com/api/lists/*',
          allowAnonymous: true,
        },
        'https://api.pm-empower.com/api/*',
      ],
    },
  },
};
