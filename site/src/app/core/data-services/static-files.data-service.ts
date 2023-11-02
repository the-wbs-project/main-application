import { HttpClient } from '@angular/common/http';
import { saveAs } from '@progress/kendo-file-saver';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export class StaticFileDataService {
  constructor(private readonly http: HttpClient) {}

  getUrl(fileId: string): string {
    return `https://static.pm-empower.com/api/${fileId}`;
  }

  getUrlForOwner(owner: string, fileId: string): string {
    return `https://static.pm-empower.com/api/${owner}/${fileId}`;
  }

  getAsync(fileId: string): Observable<ArrayBuffer> {
    return this.http.get(this.getUrl(fileId), {
      responseType: 'arraybuffer',
    });
  }

  getForOwnerAsync(owner: string, fileId: string): Observable<ArrayBuffer> {
    return this.http.get(this.getUrlForOwner(owner, fileId), {
      responseType: 'arraybuffer',
    });
  }

  downloadAsync(fileId: string, fileName: string): Observable<any> {
    return this.http
      .get(this.getUrl(fileId), { responseType: 'blob' as 'json' })
      .pipe(map((response: any) => saveAs(response, fileName)));
  }

  uploadAsync(fileId: string, file: ArrayBuffer): Observable<void> {
    return this.http.put<void>(this.getUrl(fileId), file);
  }

  uploadForOwnerAsync(
    owner: string,
    fileId: string,
    file: ArrayBuffer
  ): Observable<void> {
    return this.http.put<void>(this.getUrlForOwner(owner, fileId), file);
  }
}
