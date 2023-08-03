import { Context } from '../../config';
import { Resources } from '../../models';
import { CosmosDbService } from './cosmos-db.service';

export class ResourcesDataService {
  private readonly db: CosmosDbService;

  constructor(private ctx: Context) {
    this.db = new CosmosDbService(this.ctx, 'Resources', 'language');
  }

  getAllAsync(culture: string): Promise<Resources[] | undefined> {
    return this.db.getAllByPartitionAsync<Resources>(culture, true);
  }
}
