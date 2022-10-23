import { HttpClient } from '@angular/common/http';
import { UploadResults } from '@wbs/shared/models';
import { WbsNodeView } from '@wbs/shared/view-models';
import { Observable } from 'rxjs';

export class ProjectImportDataService {
  constructor(private readonly http: HttpClient) {}

  runAsync(
    file: ArrayBuffer,
    type: 'xlsx' | 'mpp'
  ): Observable<UploadResults<WbsNodeView>> {
    return this.http.post<UploadResults<WbsNodeView>>(
      `projects/import/${type}`,
      file
    );
  }
}
