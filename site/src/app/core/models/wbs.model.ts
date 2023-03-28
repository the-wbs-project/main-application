import { TaggedObject } from './app-models';
import { Activity } from './activity.model';

export interface Wbs extends TaggedObject {
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
  lastModifiedOn: number;
}
