import { FileInfo } from '@progress/kendo-angular-upload';
import { ContentResource } from '@wbs/core/models';

export interface RecordEditResults {
  record: Partial<ContentResource>;
  file?: FileInfo;
}
