export interface WbsNodeView {
  id: string;
  parentId: string | null;
  disciplines?: string[] | null;
  order: number;
  levels: number[];
  levelText: string;
  title: string;
  description?: string | null;
  children: number;
}
