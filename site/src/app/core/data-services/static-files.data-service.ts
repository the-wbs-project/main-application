import { HttpClient } from '@angular/common/http';
import { saveAs } from '@progress/kendo-file-saver';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export class StaticFileDataService {
  constructor(private readonly http: HttpClient) {}

  getResourceFileUrl(prefix: string, resourceId: string): string {
    return `${prefix}/resources/${resourceId}/blob`;
  }

  getResourceFileAsync(
    prefix: string,
    resourceId: string
  ): Observable<ArrayBuffer> {
    return this.http.get(this.getResourceFileUrl(prefix, resourceId), {
      responseType: 'arraybuffer',
    });
  }

  downloadAsync(fileId: string, fileName: string): Observable<void> {
    return this.http
      .get(`api/files/${fileId}`, { responseType: 'arraybuffer' })
      .pipe(
        map((response: ArrayBuffer) => saveAs(new Blob([response]), fileName))
      );
  }
}
