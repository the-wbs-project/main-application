import { Context } from '../../config';
import { Resources } from '../../models';
import { CosmosDbService } from './cosmos-db.service';

export class ResourcesDataService {
  private _db?: CosmosDbService;

  constructor(private ctx: Context) {}

  getAllAsync(culture: string): Promise<Resources[] | undefined> {
    return this.db.getAllByPartitionAsync<Resources>(culture, true);
  }

  private get db(): CosmosDbService {
    if (!this._db) {
      this._db = new CosmosDbService(this.ctx, '_common', 'Resources', 'language');
    }
    return this._db;
  }
}
