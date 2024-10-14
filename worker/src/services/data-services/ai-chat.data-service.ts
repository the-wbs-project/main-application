import { Env } from '../../config';

export class AiChatDataService {
  private readonly prefix = 'CHAT';

  constructor(private readonly env: Env, private readonly executionCtx: ExecutionContext) {}

  async getAsync(model: string, userId: string): Promise<any[]> {
    return (await this.env.KV_DATA.get<any[]>(this.key(model, userId), 'json')) ?? [];
  }

  async putAsync(model: string, userId: string, items: any[]): Promise<void> {
    this.executionCtx.waitUntil(this.env.KV_DATA.put(this.key(model, userId), JSON.stringify(items)));
  }

  async deleteAsync(model: string, userId: string): Promise<void> {
    this.executionCtx.waitUntil(this.env.KV_DATA.delete(this.key(model, userId)));
  }

  private key(model: string, userId: string): string {
    return [this.prefix, userId.replace('auth0|', ''), model].join('|');
  }
}
