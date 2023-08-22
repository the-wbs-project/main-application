import { Context } from '../../config';
import { Resources } from '../../models';
import { AzureService } from '../azure.service';

export class ResourcesDataService {
  constructor(private ctx: Context) {}

  getAsync(locale: string): Promise<Record<string, Record<string, string>>> {
    return AzureService.getAsync<Record<string, Record<string, string>>>(this.ctx, `resources/all/${locale}`);
  }

  async putAsync(resources: Resources): Promise<void> {
    await AzureService.putAsync(this.ctx, `resources`, resources);
  }
}
