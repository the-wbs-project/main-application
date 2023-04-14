export interface Env {
  KV_AUTH: KVNamespace;
  KV_DATA: KVNamespace;
  BUCKET_SNAPSHOTS: R2Bucket;
  BUCKET_STATICS: R2Bucket;

  AUTH_AUDIENCE: string;
  AUTH_CLIENT_ID: string;
  AUTH_CLIENT_SECRET: string;
  AUTH_CONNECTION: string;
  AUTH_DOMAIN: string;

  AZURE_ENDPOINT: string;
  AZURE_KEY: string;

  COSMOS_ENDPOINT: string;
  COSMOS_KEY: string;

  MAILGUN_ENDPOINT: string;
  MAILGUN_KEY: string;

  APP_INSIGHTS_KEY: string;
  CORS_ORIGINS: string;
  DEBUG: string;
  INVITE_TEMPLATE_ID: string;
  KV_BYPASS?: string;
}
