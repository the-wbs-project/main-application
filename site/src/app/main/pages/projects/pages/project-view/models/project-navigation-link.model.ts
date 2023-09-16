export interface ProjectNavigationLink {
  fragment: string;
  title: string;
  roles?: string[];
  children?: ProjectNavigationLink[];
}
