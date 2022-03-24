import { DbObject } from './app-models';

export interface Metadata<T> extends DbObject {
  values: T;
}
