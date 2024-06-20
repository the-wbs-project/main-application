export interface Organization {
  id: string;
  name: string;
  displayName: string;
  metadata: {
    mainProjectType: 'single' | 'multiple';
    logoId?: string;
  };
}
