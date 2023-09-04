export interface Organization {
  id: string;
  display_name: string;
  name: string;
  branding: {
    logo_url?: string;
  };
  metadata: {
    mainProjectType: 'single' | 'multiple';
  };
}
