var locationHost = window.location.host;

export const environment = {
  production: false,
  appTitle: 'PM Empower',
  authClientId:
    locationHost.indexOf('localhost') > -1
      ? '44pcQ5Xo33vimvBb4G8eZfjFaGIsyWfg'
      : locationHost.indexOf('test') > -1
      ? '44pcQ5Xo33vimvBb4G8eZfjFaGIsyWfg'
      : '44pcQ5Xo33vimvBb4G8eZfjFaGIsyWfg',

  authRedirectUri:
    locationHost.indexOf('localhost') > -1
      ? 'http://localhost:4200'
      : locationHost.indexOf('test') > -1
      ? 'https://test.pmempower.com'
      : 'https://app.pmempower.com',

  initialVersionAlias: 'Initial Version',
  canTestAi: [''],
};
