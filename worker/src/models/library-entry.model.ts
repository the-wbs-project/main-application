export interface LibraryEntry {
  id: string;
  owner: string;
  type: string;
  publishedVersion?: number;
  author: string;
  lastModified: Date;
  title: string;
  description?: string;
  visibility: string;
  editors?: string[];
}
