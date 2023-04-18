import { AuthConfig } from '@auth0/auth0-angular';

export const environment = {
  production: true,
  appTitle: 'PM Empower',
  apiPrefix: 'http://localhost:88/api/',
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
          uri: 'http://localhost:88/api/resources/*',
          allowAnonymous: true,
        },
        {
          uri: 'http://localhost:88/api/lists/*',
          allowAnonymous: true,
        },
        'http://localhost:88/api/*',
      ],
    },
  },
};
