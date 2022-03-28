export interface WbsPhaseNode {
  id: string;
  parentId: string | null;
  disciplineIds?: string[];
  order: number;
  levels: number[];
  levelText: string;
  title: string;
}
