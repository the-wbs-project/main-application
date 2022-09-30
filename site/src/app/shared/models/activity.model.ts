export interface ActivityData {
  objectId?: string;
  versionId?: string;
  action: string;
  data: Record<string, any>;
}

export interface Activity extends ActivityData {
  topLevelId: string;
  timestamp: number;
  userId: string;
}
