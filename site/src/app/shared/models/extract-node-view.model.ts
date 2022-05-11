export interface ExtractNodeView {
  id: string;
  levelText: string;
  depth: number;
  order: number;
  title: string;
  description: string | null;
  disciplines?: string[] | null;
  parentId: string | null;
  phaseId: string | undefined;
}
export interface ExtractPhaseNodeView extends ExtractNodeView {
  syncWithDisciplines?: boolean;
}
