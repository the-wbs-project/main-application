import { HttpClient } from '@angular/common/http';
import { saveAs } from '@progress/kendo-file-saver';
import { Project } from '@wbs/shared/models';
import { WbsNodeView } from '@wbs/shared/view-models';
import { map, Observable } from 'rxjs';

export class ProjectExportDataService {
  constructor(private readonly http: HttpClient) {}

  runAsync(
    project: Project,
    extension: 'xlsx' | 'mpp',
    rows: WbsNodeView[]
  ): Observable<void> {
    return this.http
      .post(`projects/export/${extension}`, rows, {
        responseType: 'blob' as 'json',
      })
      .pipe(
        map((response: any) =>
          saveAs(response, `${project.title}.${extension}`)
        )
      );
  }
}
