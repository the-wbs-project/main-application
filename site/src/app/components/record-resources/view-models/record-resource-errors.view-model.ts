export interface RecordResourceErrors {
  started: boolean;
  valid: boolean;
  nameRequired?: boolean;
  urlRequired?: boolean;
  fileRequired?: boolean;
}
