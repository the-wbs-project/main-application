export class CloudflareDataService {
  constructor(private readonly context: ExecutionContext, private readonly kv: KVNamespace) {}

  get(key: string): Promise<string | null>;
  get<T>(key: string, type: 'json'): Promise<T | null>;
  get<T>(key: string, type?: 'json' | 'text'): Promise<string | null> | Promise<T | null> {
    if (type == 'json') return this.kv.get<T>(key, type);

    return this.kv.get(key, type ?? 'text');
  }

  put(
    key: string,
    value: string | ArrayBuffer | ArrayBufferView | ReadableStream,
    options?: {
      expiration?: number;
      expirationTtl?: number;
      metadata?: any;
    },
  ): Promise<void> {
    return this.kv.put(key, value, options);
  }

  putLater(
    key: string,
    value: string | ArrayBuffer | ArrayBufferView | ReadableStream,
    options?: {
      expiration?: number;
      expirationTtl?: number;
      metadata?: any;
    },
  ): void {
    this.context.waitUntil(this.kv.put(key, value, options));
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
}
