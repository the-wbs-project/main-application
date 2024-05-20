export type HeaderRouteItem = HeaderRouteLinkItem | HeaderRouteSubMenuItem;

export interface HeaderRouteSubMenuItem {
  type: 'sub';
  section?: string;
  label: string;
  claim?: string;
  items: (HeaderRouteHeaderItem | HeaderRouteLinkItem)[];
}

export interface HeaderRouteLinkItem {
  type: 'link';
  section?: string;
  route: string[];
  label: string;
  claim?: string;
}

export interface HeaderRouteHeaderItem {
  type: 'header';
  label: string;
}
