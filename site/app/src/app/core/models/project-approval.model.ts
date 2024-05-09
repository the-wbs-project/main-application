export interface ProjectApproval {
  id: string;
  projectId: string;
  approvedOn?: Date;
  isApproved?: boolean;
  approvedBy?: string;
}
