export interface AuthConfig {
  salt?: string;
  domain?: string;
  audience?: string;
  authClientId?: string;
  authClientSecret?: string;
  connection?: string;
  callbackUrl?: string;
  logoutCallbackUrl?: string;
  mgmtClientId?: string;
  mgmtClientSecret?: string;
  excludeSecureCookie?: boolean;
  cookieKey?: string;
}
