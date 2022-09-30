export interface AuthConfig {
  audience: string;
  authClientId: string;
  authClientSecret: string;
  connection: string;
  cookieKey: string;
  domain: string;
  excludeSecureCookie: boolean;
  logoutCallbackUrl: string;
  mgmtClientId: string;
  mgmtClientSecret: string;
  salt: string;
  callbackUrl: string;
}
