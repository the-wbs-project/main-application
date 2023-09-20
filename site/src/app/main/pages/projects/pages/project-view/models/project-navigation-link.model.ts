export interface ProjectNavigationLink {
  fragment?: string;
  action?: { type: string };
  title: string;
  roles?: string[];
  classes?: string[];
  children?: ProjectNavigationLink[];
}
