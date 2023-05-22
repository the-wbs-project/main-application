export interface ListItemBase {
  id: string;
  type: string;
}

export interface ListItem extends ListItemBase {
  label: string;
  description?: string;
  sameAs?: string[];
  tags: string[];
  icon?: string;
}
