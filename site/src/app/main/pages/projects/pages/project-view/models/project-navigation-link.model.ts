export interface ProjectNavigationLink {
  fragment: string;
  action: string;
  title: string;
  roles?: string[];
  classes?: string[];
  children?: ProjectNavigationLink[];
}
