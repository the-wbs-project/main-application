export interface Env {
  KV_DATA: KVNamespace;
  BUCKET_SNAPSHOTS: R2Bucket;
  BUCKET_STATICS: R2Bucket;
  AUTH_WORKER: Fetcher;
  
  APP_INSIGHTS_KEY: string;
  AUTH: string;
  AZURE: string;
  COSMOS: string;
  DEBUG: string;
  INVITE_EMAIL: string;
  KV_BYPASS?: string;
  LOGOUT_HTML: string;
  MAILGUN_API_BASE_URL: string;
  MAILGUN_API_KEY: string;
  SNIPPET_APP_INSIGHTS?: string;
  TWILIO: string;
}
