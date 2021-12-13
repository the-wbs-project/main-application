export class AuthConfig {
  get audience(): string {
    return AUTH_AUDIENCE;
  }
  get authClientId(): string {
    return AUTH_CLIENT_ID;
  }
  get authClientSecret(): string {
    return AUTH_CLIENT_SECRET;
  }
  get callbackUrl(): string {
    return AUTH_CALLBACK_URL;
  }
  get connection(): string {
    return AUTH_CONNECTION;
  }
  get cookieKey(): string {
    return AUTH_COOKIE_KEY;
  }
  get excludeSecureCookie(): boolean {
    return AUTH_EXCLUDE_SECURE_COOKIE === 'true';
  }
  get domain(): string {
    return `https://${AUTH_DOMAIN}`;
  }
  get logoutCallbackUrl(): string {
    return AUTH_LOGOUT_CALLBACK;
  }
  get mgmtClientId(): string {
    return AUTH_MGMT_CLIENT_ID;
  }
  get mgmtClientSecret(): string {
    return AUTH_MGMT_CLIENT_SECRET;
  }
  get salt(): string {
    return AUTH_SALT;
  }
}
