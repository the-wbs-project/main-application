export interface Activity {
  id: string;
  timestamp: Date;
  userId: string;
  topLevelId: string;
  objectId?: string;
  versionId?: number;
  action: string;
  data: Record<string, any>;
  actionIcon?: string;
  actionTitle?: string;
  actionDescription?: string;
}
