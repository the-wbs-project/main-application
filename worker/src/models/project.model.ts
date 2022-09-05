import { TaggedObject } from './app-models';

export interface Project extends TaggedObject {
  id: string;
  _ts: number;
  watchers?: string[];
}
