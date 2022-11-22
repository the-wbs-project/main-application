export interface Activity {
  id: string;
  label: string;
  _ts: number;
  userId: string;
  objectId: string;
  topLevelId: string;
  versionId?: string;
  action: string;
  labelTitle: string;
  data: (string | number | null | undefined)[];
}
