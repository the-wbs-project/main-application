export abstract class BaseDataService {
  constructor(protected readonly kv: KVNamespace, private readonly ctx: ExecutionContext) {}

  protected key(...parts: string[]): string {
    return parts.join('|');
  }

  protected getKv<T>(key: string): Promise<T | null> {
    return this.kv.get<T>(key, 'json');
  }

  protected putKv<T>(key: string, data: T): void {
    //
    //  Don't save null, undefined, or empty arrays.
    //
    if (data == null || data == undefined) return;
    if (Array.isArray(data) && data.length === 0) return;

    this.ctx.waitUntil(this.kv.put(key, typeof data === 'string' ? data : JSON.stringify(data)));
  }

  protected deleteKv(...keys: string[]): void {
    this.ctx.waitUntil(Promise.all(keys.map((key) => this.kv.delete(key))));
  }

  protected deleteList(prefix: string): void {
    this.ctx.waitUntil(this.deleteListAsync(prefix));
  }

  protected async getDataAsync<T>(kvKey: string, dataCall: () => Promise<T | undefined | null>): Promise<T | undefined | null> {
    const kvData = await this.getKv<T>(kvKey);

    if (kvData) return kvData;

    const apiData = await dataCall();

    this.putKv(kvKey, apiData);

    return apiData;
  }

  protected async getArrayAsync<T>(kvKey: string, dataCall: () => Promise<T[]>): Promise<T[]> {
    const kvData = await this.getKv<T[]>(kvKey);

    if (kvData) return kvData;

    const apiData = await dataCall();

    this.putKv(kvKey, apiData);

    return apiData ?? [];
  }

  protected async updateDataAsync<T>(kvKey: string, dataCall: () => Promise<T | undefined | null>): Promise<void> {
    this.putKv(kvKey, await dataCall());
  }

  private async deleteListAsync(prefix: string): Promise<void> {
    const keys = await this.kv.list({ prefix });

    for (const key of keys.keys) {
      this.kv.delete(key.name);
    }
  }
}
