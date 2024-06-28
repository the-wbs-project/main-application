export interface Membership {
  id: string;
  name: string;
  displayName: string;
  roles: string[];
  metadata: {
    mainProjectType?: 'single' | 'multiple';
    projectApprovalRequired?: boolean;
    seatCount?: number;
  };
}
