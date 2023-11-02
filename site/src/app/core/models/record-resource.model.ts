import { RESOURCE_TYPE_TYPE } from './enums';

export interface RecordResource {
  id: string;
  type: RESOURCE_TYPE_TYPE;
  ownerId: string;
  recordId: string;
  name: string;
  description: string;
  createdOn: Date;
  lastModified: Date;
  order: number;
  resource?: string;
}
