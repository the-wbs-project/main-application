import { TaggedObject } from './app-models';

export interface TrainingMaterial extends TaggedObject {
  id: string;
  name: string;
  tags: string[];
  categories: string[];
  intro: string;
  sections: any[];
  suggestions: any[];
  documents: any[];
  links: any[];
}
