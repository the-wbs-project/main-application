import { Activity } from '@app/models';

export interface WbsNodeViewModel {
  id: string;
  parentLevel: string | null;
  parentId: string | null;
  order: number;
  depth: number;
  level: string;
  levels: number[];
  title?: string;
  phaseCategoryId?: string;
  disciplineIds?: string[];
  trainingId?: string;
  referenceId?: string;
  activity?: Activity[];
  thread?: any;
  //children?: WbsNodeViewModel[] | null;
}
