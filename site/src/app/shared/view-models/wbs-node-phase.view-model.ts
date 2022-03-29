export interface WbsNodePhaseViewModel {
  id: string;
  parentId: string | null;
  order: number;
  levels: number[];
  levelText: string;
  title: string;
}
