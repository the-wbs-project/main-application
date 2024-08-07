export interface Organization {
  id: string;
  name: string;
  display_name: string;
  branding?: {
    logo_url: string;
  };
  metadata: {
    mainProjectType?: 'single' | 'multiple';
    projectApprovalRequired?: 'true' | 'false';
  };
}
