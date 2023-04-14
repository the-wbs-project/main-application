import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ProjectImportResult, UploadResults } from '../models';

export class ProjectImportDataService {
  constructor(private readonly http: HttpClient) {}

  runAsync(
    file: ArrayBuffer,
    type: string
  ): Observable<UploadResults<ProjectImportResult>> {
    return this.http.post<UploadResults<ProjectImportResult>>(
      `api/projects/import/${type}`,
      file
    );
  }
}
