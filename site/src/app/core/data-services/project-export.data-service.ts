import { HttpClient } from '@angular/common/http';
import { saveAs } from '@progress/kendo-file-saver';
import { map, Observable } from 'rxjs';
import { Project } from '../models';
import { WbsNodeView } from '../view-models';

export class ProjectExportDataService {
  constructor(private readonly http: HttpClient) {}

  runAsync(
    project: Project,
    extension: 'xlsx' | 'mpp',
    rows: WbsNodeView[]
  ): Observable<any> {
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
