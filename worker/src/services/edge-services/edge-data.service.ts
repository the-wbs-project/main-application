export interface EdgeDataService {
  byPass(key: string): boolean;

  get(key: string): KVValue<string>;

  get<T>(key: string, type: "json"): KVValue<T>;

  put(
    key: string,
    value: string | ReadableStream | ArrayBuffer | FormData,
    options?: {
      expiration?: string | number;
      expirationTtl?: string | number;
      metadata?: any;
    }
  ): Promise<void>;

  putLater(
    key: string,
    value: string | ReadableStream | ArrayBuffer | FormData,
    options?: {
      expiration?: string | number;
      expirationTtl?: string | number;
      metadata?: any;
    }
  ): void;

  delete(key: string): Promise<void>;

  clear(): Promise<void>;
}
