export interface ProjectApprovalSaveRecord {
  ids: string[];
  projectId: string;
  approvedOn?: Date;
  isApproved?: boolean;
  approvedBy?: string;
}
