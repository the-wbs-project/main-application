import { DbObject } from "./db-object.model";

export interface Resources extends DbObject {
  values?: { [category: string]: { [key: string]: string } };
}
