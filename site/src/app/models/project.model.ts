import { PROJECT_STATI_TYPE } from './enums';

export interface ProjectLite {
  id: string;
  owner: string;
  title: string;
  lastModified: Date;
  status: PROJECT_STATI_TYPE;
}
