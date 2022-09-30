import { DbObject } from './db-object.model';

export interface Resources extends DbObject {
  values?: Record<string, Record<string, string>>;
}
