import { Context } from '../../config';
import { Resources } from '../../models';
import { CosmosDbService } from './cosmos-db.service';

export class ResourcesDataService {
  private readonly db: CosmosDbService;

  constructor(private ctx: Context) {
    this.db = new CosmosDbService(this.ctx, 'Resources', 'language');
  }

  getAsync(culture: string): Promise<Resources[] | undefined> {
    return this.db.getAllByPartitionAsync<Resources>(culture, true);
  }

  putAsync(resources: Resources): Promise<void> {
    return this.db.upsertDocument(resources, resources.language);
  }
}
