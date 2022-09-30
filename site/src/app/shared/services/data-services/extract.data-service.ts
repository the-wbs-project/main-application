import { HttpClient } from '@angular/common/http';
import { saveAs } from '@progress/kendo-file-saver';
import {
  Project,
  PROJECT_NODE_VIEW_TYPE,
  UploadResults,
} from '@wbs/shared/models';
import { WbsNodeView } from '@wbs/shared/view-models';
import { map, Observable } from 'rxjs';

export class ExtractDataService {
  constructor(private readonly http: HttpClient) {}

  downloadNodesAsync(
    project: Project,
    rows: WbsNodeView[],
    view: PROJECT_NODE_VIEW_TYPE
  ): Observable<void> {
    let view2: string = view[0].toUpperCase() + view.substring(1);

    const fileName = `${project.title} - ${view2}.xlsx`;
    return this.http
      .post(`projects/extracts/${view}/download`, rows, {
        responseType: 'blob' as 'json',
      })
      .pipe(map((response: any) => saveAs(response, fileName)));
  }

  updatePhaseAsync(file: ArrayBuffer): Observable<UploadResults<WbsNodeView>> {
    return this.http.post<UploadResults<WbsNodeView>>(
      'projects/extracts/phase/upload',
      file
    );
  }
}
