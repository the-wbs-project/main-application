import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { WbsImportResult, UploadResults } from '../models';

export class WbsImportDataService {
  constructor(private readonly http: HttpClient) {}

  runAiAsync(
    owner: string,
    fileName: string,
    file: ArrayBuffer
  ): Observable<UploadResults<WbsImportResult>> {
    return this.http.post<UploadResults<WbsImportResult>>(
      `api/import/ai/${owner}/${fileName}`,
      file
    );
  }

  runAsync(
    type: string,
    file: ArrayBuffer
  ): Observable<UploadResults<WbsImportResult>> {
    return this.http.post<UploadResults<WbsImportResult>>(
      `api/import/${type}/en-US`,
      file
    );
  }
}
