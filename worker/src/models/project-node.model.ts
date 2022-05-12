export interface ProjectNode {
  id: string;
  projectId: string;
  parentId: string;
  phase: {
    isDisciplineNode?: boolean;
    order: number;
    syncWithDisciplines?: boolean;
    parentId?: string;
  };
  discipline?: [
    {
      disciplineId: string;
      order: number;
      isPhaseNode?: boolean;
      phaseId?: boolean;
      parentId?: boolean;
    },
  ];
  removed?: boolean;
}
