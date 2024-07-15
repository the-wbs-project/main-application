import { HttpClient } from '@angular/common/http';
import { saveAs } from '@progress/kendo-file-saver';
import { map, Observable } from 'rxjs';
import { ProjectCategory } from '../models';
import { TaskViewModel } from '../view-models';

export class WbsExportDataService {
  constructor(private readonly http: HttpClient) {}

  runAsync(
    fileName: string,
    extension: 'xlsx' | 'mpp',
    disciplines: ProjectCategory[],
    tasks: TaskViewModel[]
  ): Observable<any> {
    return this.http
      .post(
        `api/export/${extension}/en-US`,
        {
          customDisciplines: disciplines,
          tasks: tasks.map((t) => ({
            level: t.levelText,
            title: t.title,
            disciplines: t.disciplines.map((d) => d.label),
          })),
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
