export interface Activity {
  timestamp: Date;
  orgId: string;
  userId: string;
  projectId?: string;
  wbsId?: string;
  area: string;
  action: string;
  data: any;
}
