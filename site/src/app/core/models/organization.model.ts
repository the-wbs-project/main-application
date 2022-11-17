import { Project } from './project.model';
import { Wbs } from './wbs.model';

export interface Organization {
  id: string;
  name: string;
  logo: any;
  seatsPurchased: number;
  administrators: string[];
  seatedUsers: string[];
  projects: Project[];
  wbsLibrary: Wbs[];
}
