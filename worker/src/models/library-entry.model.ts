export interface LibraryEntry {
  id: string;
  owner: string;
  type: string;
  publishedVersion?: number;
  author: string;
  visibility: string;
  editors?: string[];
}
