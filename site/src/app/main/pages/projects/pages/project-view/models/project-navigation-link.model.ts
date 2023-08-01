export interface ProjectNavigationLink {
  fragment: string;
  title: string;
  children?: ProjectNavigationLink[];
}
