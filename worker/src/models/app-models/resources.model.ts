import { IdObject } from './db-object.model';

export type Resources = Record<string, Record<string, string>>;

export interface ResourceObj extends IdObject {
  values: Resources;
}
