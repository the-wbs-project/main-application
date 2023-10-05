import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models';

export class JiraDataService {
  constructor(private readonly http: HttpClient) {}

  createUploadIssueAsync(
    description: string,
    organization: string,
    user: User
  ): Observable<string> {
    return this.http.post<string>('api/jira/upload/create', {
      description,
      organization,
      user,
    });
  }

  uploadAttachmentAsync(
    jiraIssueId: string,
    fileName: string,
    file: ArrayBuffer
  ): Observable<void> {
    console.log(jiraIssueId, fileName, file.byteLength);
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
