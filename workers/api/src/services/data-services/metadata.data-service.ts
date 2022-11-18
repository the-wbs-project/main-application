import { IdObject, ListItem, ResourceObj, Resources } from '../../models';
import { DbService } from '../database-services';
import { EdgeDataService } from '../edge-services';

export class MetadataDataService {
  constructor(private readonly resourceDb: DbService, private readonly listDb: DbService, private readonly edge: EdgeDataService) {}

  async getResourcesAsync(culture: string, category: string): Promise<Resources | undefined> {
    return (await this.getAsync<ResourceObj>('RESOURCES', this.resourceDb, culture, category))?.values;
  }

  getListAsync(type: string): Promise<ListItem[]> {
    return this.getAllAsync<ListItem>('LISTS', this.listDb, type);
  }

  private async getAsync<T extends IdObject>(kvPrefix: string, db: DbService, pk: string, id: string): Promise<T | undefined> {
    if (this.edge.byPass(kvPrefix)) return await db.getDocumentAsync<T>(pk, id, true);

    const kvName = [kvPrefix, pk, id].join('|');
    const kvData = await this.edge.get<T>(kvName, 'json');

    if (kvData) return kvData;

    const data = await db.getDocumentAsync<T>(pk, id, true);

    if (data) this.edge.putLater(kvName, JSON.stringify(data));

    return data;
  }

  private async getAllAsync<T extends IdObject>(kvPrefix: string, db: DbService, pk: string): Promise<T[]> {
    if (this.edge.byPass(kvPrefix)) return await db.getAllByPartitionAsync<T>(pk, true);

    const kvName = [kvPrefix, pk].join('|');
    const kvData = await this.edge.get<T[]>(kvName, 'json');

    if (kvData) return kvData;

    const data = await db.getAllByPartitionAsync<T>(pk, true);

    if (data && data.length > 0) this.edge.putLater(kvName, JSON.stringify(data));

    return data;
  }
}
