import { CosmosClient } from '@cfworker/cosmos';
import { Config } from '../../../config';
import { IdObject } from '../../../models';
import { myFetch } from '../../fetcher.service';
import { Logger } from '../../logger.service';
import { DbService } from '../db.service';

declare type Rec = Record<string, unknown>;

export class CosmosDbService implements DbService {
  private readonly db: CosmosClient;

  constructor(
    config: Config,
    container: string,
    logger: Logger,
    private readonly pkVariable = 'pk',
  ) {
    this.db = new CosmosClient({
      endpoint: config.db.endpoint,
      masterKey: config.db.key,
      dbId: config.db.database,
      collId: container,
      fetch: (info: RequestInfo, init?: RequestInit) => {
        return myFetch(logger, info, init);
      },
    });
  }

  private clean(objOrArray: Rec | Rec[]): void {
    if (Array.isArray(objOrArray)) {
      for (const obj of objOrArray) this.clean(obj);
    } else if (objOrArray) {
      delete objOrArray['_rid'];
      delete objOrArray['_self'];
      delete objOrArray['_etag'];
      delete objOrArray['_ts'];
      delete objOrArray['_attachments'];
    }
  }

  async getDocumentAsync<T extends IdObject>(
    pk: string,
    id: string,
    clean: boolean,
  ): Promise<T | null> {
    const res = await this.db.getDocument<T>({
      partitionKey: pk,
      docId: id,
    });
    if (res.status === 404) return null;

    const result = await res.json();

    if (res.status !== 200) throw new Error(JSON.stringify(result));

    if (clean && result) this.clean(<any>result);

    return result;
  }

  getAllByPartitionAsync<T extends IdObject>(
    pk: string,
    clean: boolean,
    skip?: number,
    take?: number,
  ): Promise<T[]> {
    return this.getListByQueryAsync<T>(
      `SELECT * FROM c WHERE c.${this.pkVariable} = @pk`,
      clean,
      [{ name: '@pk', value: pk }],
      skip,
      take,
    );
  }

  async getListByQueryAsync<T>(
    query: string,
    clean: boolean,
    parameters?: {
      name: string;
      value: string | number | boolean | null | undefined;
    }[],
    skip?: number,
    take?: number,
  ): Promise<T[]> {
    if (skip != null && take != null) {
      query += ` OFFSET ${skip} LIMIT ${take}`;
    }
    const res = await this.db.queryDocuments<T>({
      query,
      parameters,
    });
    const results = await res.json();

    if (clean) this.clean(<Rec[]>results);

    return results;
  }

  async getByQueryAsync<T>(
    query: string,
    clean: boolean,
    parameters?: {
      name: string;
      value: string | number | boolean | null | undefined;
    }[],
  ): Promise<T | null> {
    const response = await this.db.queryDocuments<T>({
      query,
      parameters,
    });
    if (response.status === 400) console.log(await response.raw.text());

    const result = (await response.json()) || [];

    if (clean) this.clean(<Rec[]>result);

    return result.length === 0 ? null : result[0];
  }

  async upsertDocument<T extends IdObject>(
    document: T,
    pk: string,
  ): Promise<boolean> {
    const res = await this.db.createDocument({
      document,
      partitionKey: pk,
      isUpsert: true,
    });
    return res.status === 201;
  }
}
