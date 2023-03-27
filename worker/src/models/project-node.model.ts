export interface ProjectNode {
  id: string;
  projectId: string;
  parentId: string;
  order: number;
  phase: {
    order?: number;
    isDisciplineNode?: boolean;
    syncWithDisciplines?: boolean;
    parentId?: string;
  };
  discipline?: [
    {
      disciplineId: string;
      isPhaseNode?: boolean;
      phaseId?: boolean;
      parentId?: boolean;
    },
  ];
  createdOn: number;
  lastModified: number;
  removed?: boolean;
}
