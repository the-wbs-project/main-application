export interface WbsNodeView {
  children: number;
  description: string | null;
  disciplines?: string[] | null;
  id: string;
  levels: number[];
  levelText: string;
  order: number;
  parentId: string | null;
  phaseId: string | undefined;
  title: string;
}
