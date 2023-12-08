export interface HeaderRouteItem {
  label: string;
  claim?: string;
  items: (
    | { type: 'header'; label: string }
    | {
        type: 'link';
        route: string[];
        label: string;
        claim?: string;
      }
  )[];
}
