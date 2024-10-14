export interface Organization {
  id: string;
  name: string;
  aiModels: {
    choice: string;
    models?: string[];
  };
  projectApprovalRequired: boolean;
}
