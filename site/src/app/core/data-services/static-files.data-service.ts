import { HttpClient } from '@angular/common/http';
import { saveAs } from '@progress/kendo-file-saver';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export class StaticFileDataService {
  constructor(private readonly http: HttpClient) {}

  downloadAsync(fileId: string, fileName: string): Observable<void> {
    return this.http
      .get(`api/files/${fileId}`, { responseType: 'arraybuffer' })
      .pipe(
        map((response: ArrayBuffer) => saveAs(new Blob([response]), fileName))
      );
  }
}
