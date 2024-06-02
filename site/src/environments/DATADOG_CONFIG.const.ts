import { LogsInitConfiguration } from '@datadog/browser-logs';

//@ts-ignore
const config = window.appConfig;

export const DD_CONTEXT = {
  app: 'pm-empower',
  host: window.location.host,
};

export const DD_CONFIG: LogsInitConfiguration = {
  clientToken: 'pubd0e9b67a9b76d45b8156a8ce603286d7',
  site: 'us5.datadoghq.com',
  service: 'pm-empower-site',
  env: config['datadog_env'],
  forwardErrorsToLogs: false,
  sessionSampleRate: 100,
  beforeSend: (log) => {
    //
    //  Don't send dev server errors
    //
    if ((log.message ?? '').indexOf('[webpack-dev-server]') > -1) {
      return false;
    }

    return true;
  },
};
