import { CosmosClient, Document } from '@cfworker/cosmos';
import { Config } from '../../../config';
import { IdObject } from '../../../models';
import { myFetch } from '../../fetcher.service';
import { Logger } from '../../logger.service';
import { DbService } from '../db.service';

export class CosmosDbService implements DbService {
  private db?: CosmosClient;
  orgId?: string;

  constructor(
    private readonly dbId: string,
    private readonly collId: string,
    private readonly config: Config,
    private readonly logger: Logger,
    private readonly pkVariable = 'pk',
  ) {
    this.db = new CosmosClient({
      endpoint: this.config.db.endpoint,
      masterKey: this.config.db.key,
      dbId,
      collId,
      fetch: (info: RequestInfo, init?: RequestInit) => {
        return myFetch(this.logger, info, init);
      },
    });
  }

  private clean<T>(
    objOrArray: (T & Partial<Document>) | (T & Partial<Document>)[],
  ): void {
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

  getAllAsync<T extends IdObject>(
    clean: boolean,
    skip?: number,
    take?: number,
  ): Promise<T[]> {
    return this.getListByQueryAsync<T>(
      `SELECT * FROM c`,
      clean,
      [],
      skip,
      take,
      true,
    );
  }

  async getDocumentAsync<T extends IdObject>(
    pk: string,
    id: string,
    clean: boolean,
  ): Promise<T | undefined> {
    if (!this.db) throw new Error('The database has not been initiated.');

    const res = await this.db.getDocument<T>({
      partitionKey: pk,
      docId: id,
    });
    if (res.status === 404) return undefined;

    const result = await res.json();

    if (res.status !== 200) throw new Error(JSON.stringify(result));

    if (clean && result) this.clean(result);

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
    enableCrossPartition = false,
  ): Promise<T[]> {
    if (!this.db) throw new Error('The database has not been initiated.');

    if (skip != null && take != null) {
      query += ` OFFSET ${skip} LIMIT ${take}`;
    }
    const res = await this.db.queryDocuments<T>({
      query,
      parameters,
      enableCrossPartition: enableCrossPartition,
    });
    if (res.status === 404) return [];

    const results = await res.json();

    if (clean) this.clean(results);

    return results;
  }

  async getByQueryAsync<T>(
    query: string,
    clean: boolean,
    parameters?: {
      name: string;
      value: string | number | boolean | null | undefined;
    }[],
  ): Promise<T | undefined> {
    if (!this.db) throw new Error('The database has not been initiated.');

    const response = await this.db.queryDocuments<T>({
      query,
      parameters,
    });
    if (response.status === 400) console.log(await response.raw.text());

    const result = (await response.json()) || [];

    if (clean) this.clean(result);

    return result.length === 0 ? undefined : result[0];
  }

  async upsertDocument<T extends IdObject>(
    document: T,
    pk: string,
  ): Promise<number> {
    if (!this.db) throw new Error('The database has not been initiated.');

    const res = await this.db.createDocument({
      document,
      partitionKey: pk,
      isUpsert: true,
    });
    if (res.status >= 300) {
      console.log(res.status);
      console.log('The error message');
      console.log(this.dbId);
      console.log(this.dbId);
      console.log(document);
      console.log(await res.json());
    }
    return res.status;
  }
}
