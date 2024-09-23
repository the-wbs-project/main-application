import { ContextLocal } from '../../config';

export class AiChatDataService {
  private readonly prefix = 'CHAT';

  constructor(private readonly ctx: ContextLocal) {}

  async getAsync(model: string): Promise<any[]> {
    return (await this.ctx.env.KV_DATA.get<any[]>(this.key(model), 'json')) ?? [];
  }

  async putAsync(model: string, items: any[]): Promise<void> {
    this.ctx.executionCtx.waitUntil(this.ctx.env.KV_DATA.put(this.key(model), JSON.stringify(items)));
  }

  async deleteAsync(model: string): Promise<void> {
    this.ctx.executionCtx.waitUntil(this.ctx.env.KV_DATA.delete(this.key(model)));
  }

  private key(model: string): string {
    return [this.prefix, this.ctx.var.idToken.userId.replace('auth0|', ''), model].join('|');
  }
}
