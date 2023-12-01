import { RESOURCE_TYPE_TYPE } from './enums';

export interface ResourceRecord {
  id: string;
  type: RESOURCE_TYPE_TYPE;
  name: string;
  description: string;
  createdOn: Date;
  lastModified: Date;
  order: number;
  resource?: string;
}
