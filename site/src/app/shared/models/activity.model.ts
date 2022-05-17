export interface ActivityData {
  objectId: string;
  topLevelId: string;
  versionId?: string;
  action: string;
  labelTitle: string;
  data: (string | number | null | undefined)[];
}

export interface Activity extends ActivityData {
  label: string;
  timestamp: number;
  userId: string;
}
