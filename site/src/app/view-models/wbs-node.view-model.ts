import { Activity } from '@app/models';

export interface WbsNodeViewModel {
  id: string;
  depth: number;
  level: string;
  levels: number[];
  title: string;
  trainingId?: string;
  referenceId?: string;
  activity?: Activity[];
  thread?: any;
  children?: WbsNodeViewModel[] | null;
}
