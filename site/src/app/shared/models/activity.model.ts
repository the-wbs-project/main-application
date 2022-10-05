export interface ActivityData {
  objectId?: string;
  versionId?: string;
  action: string;
  data: Record<string, any>;
}

export interface Activity extends ActivityData {
  id: string;
  topLevelId: string;
  _ts: number;
  userId: string;
}
