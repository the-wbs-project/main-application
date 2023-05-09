import { IdObject } from './db-object.model';

export interface Resources extends IdObject {
  values: Record<string, Record<string, string>>;
}
