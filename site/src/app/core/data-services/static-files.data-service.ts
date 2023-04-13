///api/files/:file

import { HttpClient } from '@angular/common/http';
import { saveAs } from '@progress/kendo-file-saver';
import { map, Observable } from 'rxjs';

export class StaticFileDataService {
  constructor(private readonly http: HttpClient) {}

  downloadAsync(fileId: string, fileName: string): Observable<any> {
    return this.http
      .get(`api/files/${fileId}`, {
        responseType: 'blob' as 'json',
      })
      .pipe(map((response: any) => saveAs(response, fileName)));
  }
}
