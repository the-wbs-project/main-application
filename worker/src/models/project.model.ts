import { TaggedObject } from './app-models';

export interface Project extends TaggedObject {
  id: string;
  owner: string;
}
