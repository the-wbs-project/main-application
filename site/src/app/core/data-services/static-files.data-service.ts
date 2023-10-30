import { HttpClient } from '@angular/common/http';
import { saveAs } from '@progress/kendo-file-saver';
import { map, Observable } from 'rxjs';

export class StaticFileDataService {
  constructor(private readonly http: HttpClient) {}

  getUrlAsync(fileId: string): string {
    return `https://static.pm-empower.com/api/${fileId}`;
  }

  downloadAsync(fileId: string, fileName: string): Observable<any> {
    return this.http
      .get(this.getUrlAsync(fileId), { responseType: 'blob' as 'json' })
      .pipe(map((response: any) => saveAs(response, fileName)));
  }

  uploadloadAsync(fileId: string, fileName: string): Observable<any> {
    return this.http
      .get(`https://static.pm-empower.com/api/${fileId}`, {
        responseType: 'blob' as 'json',
      })
      .pipe(map((response: any) => saveAs(response, fileName)));
  }
}
