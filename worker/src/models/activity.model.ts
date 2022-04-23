export interface Activity {
  id?: string;
  timestamp: Date;
  orgId: string;
  userId: string;
  wbsParentId?: string;
  versionId?: string;
  wbsId?: string;
  action: string;
  data: Record<string, string | number>;
}
