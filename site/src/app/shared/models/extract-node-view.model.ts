export interface ExtractNodeView {
  id: string;
  levelText: string;
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
