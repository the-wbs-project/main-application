export interface LibraryEntryViewModel {
  ownerId: string;
  ownerName: string;
  entryId: string;
  version: number;
  author: string;
  title: string;
  description?: string;
  type: string;
  lastModified: Date;
  status: string;
  visibility: string;
}
