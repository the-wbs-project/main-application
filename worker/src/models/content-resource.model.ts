export interface ContentResource {
  id: string;
  ownerId: string;
  parentId: string;
  name: string;
  type: string;
  order: number;
  createdOn: Date;
  lastModified: Date;
  resource: string;
  description: string;
  visibility: string;
}
