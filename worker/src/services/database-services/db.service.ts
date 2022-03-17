import { IdObject } from '../../models';

export interface DbService {
  getDocumentAsync<T extends IdObject>(
    pk: string,
    id: string,
    clean: boolean,
  ): Promise<T | null>;

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
  ): Promise<T | null>;

  upsertDocument<T extends IdObject>(document: T, pk: string): Promise<boolean>;
}
