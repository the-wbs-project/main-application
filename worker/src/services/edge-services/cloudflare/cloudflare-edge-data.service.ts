import { Config } from '../../../config';
import { EdgeDataService } from '../edge-data.service';

export class CloudflareEdgeDataService implements EdgeDataService {
  constructor(
    private readonly config: Config,
    private readonly event: FetchEvent,
    private readonly kv: KVNamespace,
  ) {}

  get(key: string): KVValue<string>;
  get<T>(key: string, type: 'json'): KVValue<T>;
  get<T>(key: string, type?: 'json' | 'text'): KVValue<string> | KVValue<T> {
    if (type == 'json') return this.kv.get<T>(key, type);

    return this.kv.get(key, type ?? 'text');
  }

  put(
    key: string,
    value: string | ReadableStream<any> | ArrayBuffer | FormData,
    options?: {
      expiration?: string | number;
      expirationTtl?: string | number;
      metadata?: any;
    },
  ): Promise<void> {
    return this.kv.put(key, value, options);
  }

  putLater(
    key: string,
    value: string | ReadableStream<any> | ArrayBuffer | FormData,
    options?: {
      expiration?: string | number;
      expirationTtl?: string | number;
      metadata?: any;
    },
  ): void {
    this.event.waitUntil(this.kv.put(key, value, options));
  }

  delete(key: string): Promise<void> {
    return this.kv.delete(key);
  }

  async clear(): Promise<void> {
    const list = await this.kv.list();
    let tasks: Promise<void>[] = [];

    for (const keyInfo of list.keys) {
      tasks.push(this.kv.delete(keyInfo.name));

      if (tasks.length === 10) {
        await Promise.all(tasks);
        tasks = [];
      }
    }
    if (tasks.length > 0) {
      await Promise.all(tasks);
    }
  }

  byPass(key: string): boolean {
    return this.config.kvBypass.indexOf(key) > -1;
  }
}
