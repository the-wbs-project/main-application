export interface RecordResource {
  id: string;
  type: 'url';
  ownerId: string;
  recordId: string;
  name: string;
  description: string;
  createdOn: Date;
  lastModifiedOn: Date;
  order: number;
  resource: string;
}
