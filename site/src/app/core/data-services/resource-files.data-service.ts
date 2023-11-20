import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export class ResourceFileDataService {
  constructor(private readonly http: HttpClient) {}

  getAsync(owner: string, fileId: string): Observable<ArrayBuffer> {
    return this.http.get(`api/files/resources/${owner}/${fileId}`, {
      responseType: 'arraybuffer',
    });
  }

  uploadAsync(
    owner: string,
    fileId: string,
    file: ArrayBuffer
  ): Observable<void> {
    return this.http.put<void>(`api/files/resources/${owner}/${fileId}`, file);
  }
}
