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
  private ownerId: string | undefined;

  constructor(private readonly http: HttpClient) {}

  setOwner(ownerId: string | undefined) {
    this.ownerId = ownerId;
  }

  downloadNodesAsync(
    project: Project,
    rows: WbsNodeView[],
    view: PROJECT_NODE_VIEW_TYPE
  ): Observable<void> {
    let view2: string = view[0].toUpperCase() + view.substring(1);

    const fileName = `${project.title} - ${view2}.xlsx`;
    return this.http
      .post(
        `projects/${this.ownerId}/${project.id}/extracts/${view}/download`,
        rows,
        {
          responseType: 'blob' as 'json',
        }
      )
      .pipe(map((response: any) => saveAs(response, fileName)));
  }

  updatePhaseAsync(
    projectId: string,
    file: ArrayBuffer
  ): Observable<UploadResults<WbsNodeView>> {
    return this.http.post<UploadResults<WbsNodeView>>(
      `projects/${this.ownerId}/${projectId}/extracts/phase/upload`,
      file
    );
  }
}
