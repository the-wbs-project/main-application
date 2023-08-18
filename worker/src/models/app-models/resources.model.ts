import { IdObject } from './db-object.model';

export interface Resources extends IdObject {
  language: string;
  values: Record<string, Record<string, string>>;
}
