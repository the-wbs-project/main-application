import { Metadata } from '../../models';
import { DbService } from '../database-services';
import { EdgeDataService } from '../edge-services';

const kvPrefix = 'META';

export class MetadataDataService {
  constructor(
    private readonly db: DbService,
    private readonly edge: EdgeDataService,
  ) {}

  async getAllAsync(type: string): Promise<Metadata[]> {
    if (this.edge.byPass(kvPrefix)) return await this.listFromDbAsync(type);

    const kvName = [kvPrefix, type].join('-');
    const kvData = await this.edge.get<Metadata[]>(kvName, 'json');

    if (kvData) return kvData;

    const data = await this.listFromDbAsync(type);

    if (data) this.edge.putLater(kvName, JSON.stringify(data));

    return data;
  }

  async getAsync(type: string, id: string): Promise<Metadata | null> {
    if (this.edge.byPass(kvPrefix)) return await this.fromDbAsync(type, id);

    const kvName = [kvPrefix, type, id].join('-');
    const kvData = await this.edge.get<Metadata>(kvName, 'json');

    if (kvData) return kvData;

    const data = await this.fromDbAsync(type, id);

    if (data) this.edge.putLater(kvName, JSON.stringify(data));

    return data;
  }

  private listFromDbAsync(type: string): Promise<Metadata[]> {
    return this.db.getAllByPartitionAsync<Metadata>(type, true);
  }

  private fromDbAsync(type: string, id: string): Promise<Metadata | null> {
    return this.db.getDocumentAsync<Metadata>(type, id, true);
  }
}
