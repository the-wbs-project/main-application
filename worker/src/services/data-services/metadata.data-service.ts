import { ListItem, Metadata, Resources } from '../../models';
import { DbService } from '../database-services';
import { EdgeDataService } from '../edge-services';

const kvPrefix = 'META';

export class MetadataDataService {
  constructor(
    private readonly db: DbService,
    private readonly edge: EdgeDataService,
  ) {}

  getResourcesAsync(
    culture: string,
    category: string,
  ): Promise<Resources | null | undefined> {
    return this.getAsync<Resources>(`${culture}.${category}`);
  }

  getCategoryAsync(type: string): Promise<ListItem[] | null | undefined> {
    return this.getAsync<ListItem[]>(`categories_${type}`);
  }

  async getAsync<T>(id: string): Promise<T | null | undefined> {
    if (this.edge.byPass(kvPrefix))
      return (await this.fromDbAsync<T>(id))?.values;

    const kvName = [kvPrefix, id].join('-');
    const kvData = await this.edge.get<T>(kvName, 'json');

    if (kvData) return kvData;

    const data = (await this.fromDbAsync<T>(id))?.values;

    if (data) this.edge.putLater(kvName, JSON.stringify(data));

    return data;
  }

  private fromDbAsync<T>(id: string): Promise<Metadata<T> | null> {
    return this.db.getDocumentAsync<Metadata<T>>(id, id, true);
  }
}
