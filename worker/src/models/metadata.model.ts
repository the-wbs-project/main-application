import { IdObject } from './app-models';

export interface Metadata<T> extends IdObject {
  values: T;
}
