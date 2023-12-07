export interface LibraryEntry {
  id: string;
  owner: string;
  publishedVersion?: number;
  author: string;
  lastModified: Date;
  title: string;
  description: string;
  visibility: number;
}
