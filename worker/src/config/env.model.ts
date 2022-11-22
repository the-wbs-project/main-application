import { AssetManifestType } from '@cloudflare/kv-asset-handler/dist/types';

export interface Env {
  KV_AUTH: KVNamespace;
  KV_DATA: KVNamespace;
  __STATIC_CONTENT: KVNamespace;
  __STATIC_CONTENT_MANIFEST: AssetManifestType;
  BUCKET_SNAPSHOTS: R2Bucket;
  BUCKET_STATICS: R2Bucket;

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
