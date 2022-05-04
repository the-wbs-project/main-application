export interface ExtractNodeView {
  id: string;
  levelText: string;
  order: number;
  title: string;
  description: string | null;
  disciplineIds?: string[] | null;
}
export interface ExtractPhaseNodeView extends ExtractNodeView {
  syncWithDisciplines?: boolean;
}
