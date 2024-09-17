export interface AbsTreeItem {
  id: string;
  parentId?: string;
  levelText: string;
  title: string;
  absFlag?: 'set' | 'implied';
}
