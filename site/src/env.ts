var locationHost = window.location.host;

export const environment = {
  production: false,
  appTitle: 'PM Empower',
  authClientId:
    locationHost.indexOf('localhost') > -1
      ? '44pcQ5Xo33vimvBb4G8eZfjFaGIsyWfg'
      : locationHost.indexOf('test') > -1
      ? 'zfvKgtPltxHsUGNPMYvF6JRljlp6xDuC'
      : 'fcglfNwfePIkurCZYGTE7lkIxbfPnyWk',

  authRedirectUri:
    locationHost.indexOf('localhost') > -1
      ? 'http://localhost:4200/callback'
      : locationHost.indexOf('test') > -1
      ? 'https://test.pm-empower.com'
      : 'https://app.pm-empower.com',

  initialVersionAlias: 'Initial Version',
  canTestAi: [''],
};
