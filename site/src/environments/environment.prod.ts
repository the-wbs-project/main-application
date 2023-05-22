export const environment = {
  production: false,
  appTitle: 'PM Empower',
  apiPrefix: 'https://api.pm-empower.com/api/',
  auth_clientId: '1nOKv3soErPVx2nJlfZFZdIqYkjUnMkX',
  datadog: {
    clientToken: 'pub3cd763417a98f3cb71ee3ab8d19ddecb',
    site: 'datadoghq.com',
    service: 'pm-empower-site',
    env: 'production',
    forwardErrorsToLogs: true,
    sessionSampleRate: 100,
  },
  datadogContext: {
    app: 'pm-empower',
    host: window.location.hostname,
  },
};
