import { HttpClient } from '@angular/common/http';
import { saveAs } from '@progress/kendo-file-saver';
import { map, Observable } from 'rxjs';
import { ListItem, Project } from '../models';
import { WbsNodeView } from '../view-models';

export class ProjectExportDataService {
  constructor(private readonly http: HttpClient) {}

  runAsync(
    project: Project,
    extension: 'xlsx' | 'mpp',
    customDisciplines: ListItem[],
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
        map((response: any) =>
          saveAs(response, `${project.title}.${extension}`)
        )
      );
  }
}
