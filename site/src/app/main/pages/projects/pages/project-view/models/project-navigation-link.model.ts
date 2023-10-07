export interface ProjectNavigationLink {
  fragment?: string;
  action?: { type: string };
  title: string;
  classes?: string[];
  children?: ProjectNavigationLink[];
  claim?: string;
}
