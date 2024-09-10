import { Activity } from './activity.model';

export interface Wbs {
  id: string;
  version: number;
  promoted: boolean;
  name: string;
  categories: string[];
  activity: Activity[];
  trainingId?: string;
  author: string;
  contributors: string[];
  language: string;
  createdOn: number;
  lastModified: number;
}
