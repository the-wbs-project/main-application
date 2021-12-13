import { Document } from '@cfworker/cosmos';

export interface DbObject extends Document {
  pk: string;
}
