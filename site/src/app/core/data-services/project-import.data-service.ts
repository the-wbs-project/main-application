import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ProjectImportResult, UploadResults } from '../models';

export class ProjectImportDataService {
  constructor(private readonly http: HttpClient) {}

  runAiAsync(
    owner: string,
    fileName: string,
    file: ArrayBuffer
  ): Observable<UploadResults<ProjectImportResult>> {
    return this.http.post<UploadResults<ProjectImportResult>>(
      `api/import/ai/${owner}/${fileName}`,
      file
    );
  }

  runAsync(
    type: string,
    file: ArrayBuffer
  ): Observable<UploadResults<ProjectImportResult>> {
    return this.http.post<UploadResults<ProjectImportResult>>(
      `api/import/${type}/en-US`,
      file
    );
  }
}
