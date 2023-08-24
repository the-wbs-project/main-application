export interface Organization {
  id: string;
  display_name: string;
  name: string;
  branding: {
    mainProjectType: 'single' | 'multiple';
    logo_url?: string;
  };
}
