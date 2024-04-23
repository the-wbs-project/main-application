export interface LibrarySearchDocument {
  entryId: string;
  version: number;
  ownerId: string;
  ownerName: string;
  title_en: string;
  description_en: string;
  typeId: string;
  typeName: string;
  lastModified: Date;
  statusId: string;
  statusName: string;
  visibility: string;
  author: {
    id: string;
    name: string;
  };
  watchers: {
    id: string;
    name: string;
  }[];
}
