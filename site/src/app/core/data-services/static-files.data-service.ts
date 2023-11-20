import { HttpClient } from '@angular/common/http';
import { saveAs } from '@progress/kendo-file-saver';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export class StaticFileDataService {
  constructor(private readonly http: HttpClient) {}

  getAsync(fileId: string): Observable<ArrayBuffer> {
    return this.http.get(`api/files/statics/${fileId}`, {
      responseType: 'arraybuffer',
    });
  }

  downloadAsync(fileId: string, fileName: string): Observable<void> {
    return this.http
      .get(`api/files/statics/${fileId}`, { responseType: 'blob' as 'json' })
      .pipe(map((response: any) => saveAs(response, fileName)));
  }
}
