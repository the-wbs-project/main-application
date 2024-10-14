export interface Membership {
  id: string;
  name: string;
  aiModels: {
    choice: string;
    models?: string[];
  };
  projectApprovalRequired: boolean;
  roles: string[];
}
