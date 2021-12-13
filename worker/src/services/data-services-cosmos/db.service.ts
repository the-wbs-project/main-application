import {
  CosmosClient,
  CosmosClientConfig,
  QueryDocumentsArgs,
} from '@cfworker/cosmos';
import { DbObject } from '../../models';

export class DbService {
  static getConfiguration(): CosmosClientConfig {
    return {
      endpoint: COSMOS_ENDPOINT,
      masterKey: COSMOS_KEY,
      collId: COSMOS_COLLECTION,
      dbId: COSMOS_DB,
    };
  }

  async getDocumentAsync<T extends DbObject>(
    db: CosmosClient,
    pk: string,
    id: string,
  ): Promise<T | null> {
    const res = await db.getDocument<T>({
      partitionKey: pk,
      docId: id,
    });
    if (res.status === 404) return null;

    const result = await res.json();

    if (res.status === 200) return result;

    throw new Error(JSON.stringify(result));
  }

  getAllByPartitionAsync<T extends DbObject>(
    db: CosmosClient,
    pk: string,
  ): Promise<T[]> {
    return this.getListByQueryAsync<T>(db, {
      query: 'SELECT * FROM c WHERE c.pk = @pk',
      parameters: [{ name: '@pk', value: pk }],
    });
  }

  async getListByQueryAsync<T extends DbObject>(
    db: CosmosClient,
    query: QueryDocumentsArgs,
  ): Promise<T[]> {
    const res = await db.queryDocuments<T>(query);
    return await res.json();
  }

  async getByQueryAsync<T>(
    db: CosmosClient,
    query: QueryDocumentsArgs,
  ): Promise<T | null> {
    const response = await db.queryDocuments<T>(query);

    if (response.status === 400) console.log(await response.raw.text());

    const result = (await response.json()) || [];

    return result.length == 0 ? null : result[0];
  }

  async upsertDocument<T extends DbObject>(
    db: CosmosClient,
    document: T,
  ): Promise<boolean> {
    const res = await db.createDocument({
      document,
      partitionKey: document.pk,
      isUpsert: true,
    });
    return res.status === 201;
  }
}
