import { HttpClient } from '@angular/common/http';
import { saveAs } from '@progress/kendo-file-saver';
import { map, Observable } from 'rxjs';
import { ProjectCategory } from '../models';
import { WbsNodeView } from '../view-models';

export class WbsExportDataService {
  constructor(private readonly http: HttpClient) {}

  runAsync(
    fileName: string,
    extension: 'xlsx' | 'mpp',
    customDisciplines: ProjectCategory[],
    nodes: WbsNodeView[]
  ): Observable<any> {
    return this.http
      .post(
        `api/export/${extension}/en-US`,
        {
          customDisciplines,
          nodes,
        },
        {
          responseType: 'blob' as 'json',
        }
      )
      .pipe(
        map((response: any) => saveAs(response, `${fileName}.${extension}`))
      );
  }
}
