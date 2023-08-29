export interface Activity {
  id: string;
  action: string;
  timestamp: number;
  userId: string;
  objectId: string;
  ownerId?: string;
  topLevelId: string;
  versionId?: string;
  data: (string | number | null | undefined)[];
}

export interface ActivityViewModel extends Activity {
  actionIcon?: string;
  actionTitle?: string;
  actionDescription?: string;
}
