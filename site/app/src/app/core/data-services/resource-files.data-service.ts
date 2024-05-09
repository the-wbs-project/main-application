import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export class ResourceFileDataService {
  constructor(private readonly http: HttpClient) {}

  getAsync(owner: string, fileId: string): Observable<ArrayBuffer> {
    return this.http.get(`api/portfolio/${owner}/files/${fileId}`, {
      responseType: 'arraybuffer',
    });
  }

  uploadAsync(
    owner: string,
    fileId: string,
    file: ArrayBuffer
  ): Observable<void> {
    return this.http.put<void>(`api/portfolio/${owner}/files/${fileId}`, file);
  }
}
