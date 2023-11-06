import { Context } from '../../config';
import { Resources } from '../../models';
import { OriginService } from '../origin.service';

export class ResourcesDataService {
  constructor(private readonly ctx: Context) {}

  private get origin(): OriginService {
    return this.ctx.get('origin');
  }

  getAsync(locale: string): Promise<Record<string, Record<string, string>> | undefined> {
    return this.origin.getAsync<Record<string, Record<string, string>>>(`resources/all/${locale}`);
  }

  async putAsync(resources: Resources): Promise<void> {
    await this.origin.putAsync(resources, `resources`);
  }
}
