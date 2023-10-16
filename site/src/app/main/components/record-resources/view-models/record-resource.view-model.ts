import { FileInfo } from '@progress/kendo-angular-upload';
import { RESOURCE_TYPE_TYPE } from '@wbs/core/models';

export interface RecordResourceViewModel {
  id?: string;
  type?: RESOURCE_TYPE_TYPE;
  name: string;
  description: string;
  url: string;
  file?: FileInfo;
  errors: {
    nameRequired?: boolean;
    descriptionRequired?: boolean;
    urlRequired?: boolean;
    fileRequired?: boolean;
  };
}
