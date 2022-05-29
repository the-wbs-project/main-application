export interface AuthConfig {
  audience: string;
  authClientId: string;
  authClientSecret: string;
  connection: string;
  cookieKey: string;
  excludeSecureCookie: boolean;
  domain: string;
  logoutCallbackUrl: string;
  mgmtClientId: string;
  mgmtClientSecret: string;
  salt: string;
}
