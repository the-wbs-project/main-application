import { RESOURCE_TYPE_TYPE } from './enums';

export interface ContentResource {
  id: string;
  ownerId: string;
  parentId: string;
  type: RESOURCE_TYPE_TYPE;
  name: string;
  description: string;
  createdOn: Date;
  lastModified: Date;
  order: number;
  resource?: string;
  visibility?: string;
}
