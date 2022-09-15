export interface ListItem {
  id: string;
  type: string;
  label: string;
  description?: string;
  sameAs?: string[];
  tags: string[];
  icon?: string;
}
