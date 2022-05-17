import { IdObject } from '../../models';

export interface DbService {
  getDocumentAsync<T extends IdObject>(
    pk: string,
    id: string,
    clean: boolean,
  ): Promise<T | undefined>;

  getAllAsync<T extends IdObject>(
    clean: boolean,
    skip?: number,
    take?: number,
  ): Promise<T[]>;

  getAllByPartitionAsync<T extends IdObject>(
    pk: string,
    clean: boolean,
    skip?: number,
    take?: number,
  ): Promise<T[]>;

  getListByQueryAsync<T>(
    query: string,
    clean: boolean,
    parameters?: {
      name: string;
      value: string | number | boolean | null | undefined;
    }[],
    skip?: number,
    take?: number,
  ): Promise<T[]>;

  getByQueryAsync<T>(
    query: string,
    clean: boolean,
    parameters?: {
      name: string;
      value: string | number | boolean | null | undefined;
    }[],
  ): Promise<T | undefined>;

  upsertDocument<T extends IdObject>(document: T, pk: string): Promise<boolean>;
}
