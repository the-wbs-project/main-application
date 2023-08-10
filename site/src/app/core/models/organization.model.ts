export interface Organization {
  id: string;
  display_name: string;
  name: string;
  metadata: {
    mainProjectType: 'single' | 'multiple';
    logo?: string;
  };
}
