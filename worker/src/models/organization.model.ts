export interface Organization {
  id: string;
  name: string;
  isActive: boolean;
  mainProjectType: 'single' | 'multiple';
  disciplines: string[];
}
