export interface ListItemBase {
  id: string;
  type: string;
}

export interface ListItem extends ListItemBase {
  label: string;
  order: number;
  description?: string;
  sameAs?: string[];
  tags: string[];
  icon?: string;
}
