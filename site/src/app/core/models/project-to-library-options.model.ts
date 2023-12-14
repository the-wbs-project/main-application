export interface ProjectToLibraryOptions {
  author: string;
  title: string;
  description: string | null;
  includeResources: boolean;
  categories: string[] | null;
  visibility: string;
}
