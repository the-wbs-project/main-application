import { Context } from '../../config';
import { Organization } from '../../models';
import { CosmosDbService } from './cosmos-db.service';

export class OrganizationDataService {
  private readonly db: CosmosDbService;

  constructor(private readonly ctx: Context) {
    this.db = new CosmosDbService(this.ctx, 'Organizations', 'id');
  }

  getAsync(id: string): Promise<Organization | undefined> {
    return this.db.getDocumentAsync<Organization>(id, id, true);
  }
}
