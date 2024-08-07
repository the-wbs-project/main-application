export type Env = {
  readonly KV_DATA: KVNamespace;

  readonly QUEUE_REFRESH_ALL: Queue;

  readonly AUTH_URL: string;
  readonly AUTH_AUDIENCE: string;
  readonly AUTH_DOMAIN: string;
  readonly AUTH_M2M_CLIENT_ID: string;
  readonly AUTH_M2M_CLIENT_SECRET: string;

  readonly DATADOG_API_KEY: string;
  readonly DATADOG_ENV: string;
  readonly DATADOG_HOST: string;

  readonly SEARCH_ENDPOINT: string;
  readonly SEARCH_INDEX_NAME: string;
  readonly SEARCH_API_KEY: string;

  readonly CORS_ORIGINS: string;
};
