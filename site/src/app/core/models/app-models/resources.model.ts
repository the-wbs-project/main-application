import { DbObject } from './db-object.model';

export interface ResourceSection extends DbObject {
  values?: Record<string, Record<string, string>>;
}
