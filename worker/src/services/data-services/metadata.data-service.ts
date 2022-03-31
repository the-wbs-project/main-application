import { Category, Metadata, METADATA_TYPES, Resources } from '../../models';
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
    return this.getAsync<Resources>(
      METADATA_TYPES.RESOURCES,
      `${culture}.${category}`,
    );
  }

  getCategoriesAsync(type: string): Promise<Category[] | null | undefined> {
    return this.getAsync<Category[]>(METADATA_TYPES.CATEGORIES, type);
  }

  async getAllAsync<T>(type: string): Promise<Metadata<T>[]> {
    if (this.edge.byPass(kvPrefix)) return await this.listFromDbAsync(type);

    const kvName = [kvPrefix, type].join('-');
    const kvData = await this.edge.get<Metadata<T>[]>(kvName, 'json');

    if (kvData) return kvData;

    const data = await this.listFromDbAsync<T>(type);

    if (data) this.edge.putLater(kvName, JSON.stringify(data));

    return data;
  }

  async getAsync<T>(type: string, id: string): Promise<T | null | undefined> {
    if (this.edge.byPass(kvPrefix))
      return (await this.fromDbAsync<T>(type, id))?.values;

    const kvName = [kvPrefix, type, id].join('-');
    const kvData = await this.edge.get<T>(kvName, 'json');

    if (kvData) return kvData;

    const data = (await this.fromDbAsync<T>(type, id))?.values;

    if (data) this.edge.putLater(kvName, JSON.stringify(data));

    return data;
  }

  private listFromDbAsync<T>(type: string): Promise<Metadata<T>[]> {
    return this.db.getAllByPartitionAsync<Metadata<T>>(type, true);
  }

  private fromDbAsync<T>(
    type: string,
    id: string,
  ): Promise<Metadata<T> | null> {
    return this.db.getDocumentAsync<Metadata<T>>(type, id, true);
  }
}
