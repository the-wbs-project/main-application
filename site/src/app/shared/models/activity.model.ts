export interface ActivityData {
  objectId?: string;
  versionId?: string;
  action: string;
  labelTitle: string;
  data: (string | number | null | undefined)[];
}

export interface Activity extends ActivityData {
  topLevelId: string;
  timestamp: number;
  userId: string;
}
