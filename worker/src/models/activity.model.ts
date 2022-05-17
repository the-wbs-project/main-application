export interface Activity {
  label: string;
  timestamp: number;
  userId: string;
  objectId: string;
  topLevelId: string;
  versionId?: string;
  action: string;
  labelTitle: string;
  data: (string | number | null | undefined)[];
}
