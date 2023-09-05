export interface ActivityData {
  topLevelId: string;
  objectId?: string;
  versionId?: string;
  action: string;
  data: Record<string, any>;
}

export interface Activity extends ActivityData {
  id: string;
  timestamp: Date;
  userId: string;
}
