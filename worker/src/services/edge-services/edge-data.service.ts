export interface EdgeDataService {
  byPass(key: string): boolean;

  get(key: string): Promise<string | null>;

  get<T>(key: string, type: 'json'): Promise<T | null>;

  put(
    key: string,
    value: string | ArrayBuffer | ArrayBufferView | ReadableStream,
    options?: {
      expiration?: number;
      expirationTtl?: number;
      metadata?: any;
    },
  ): Promise<void>;

  putLater(
    key: string,
    value: string | ArrayBuffer | ArrayBufferView | ReadableStream,
    options?: {
      expiration?: number;
      expirationTtl?: number;
      metadata?: any;
    },
  ): void;

  delete(key: string): Promise<void>;

  clear(): Promise<void>;
}
