import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models';

export class JiraDataService {
  constructor(private readonly http: HttpClient) {}

  createUploadIssueAsync(description: string, user: User): Observable<string> {
    return this.http.post<string>('api/jira/upload/create', {
      description,
      user,
    });
  }

  uploadAttachmentAsync(
    jiraIssueId: string,
    fileName: string,
    file: ArrayBuffer
  ): Observable<void> {
    return this.http.post<void>(
      `api/jira/upload/${jiraIssueId}/attachment`,
      file,
      {
        headers: {
          'x-filename': fileName,
        },
      }
    );
  }
}
