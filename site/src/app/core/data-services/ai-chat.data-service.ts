import { HttpClient } from '@angular/common/http';
import { Message } from '@progress/kendo-angular-conversational-ui';
import { Observable, map } from 'rxjs';

export class AiChatDataService {
  constructor(private readonly http: HttpClient) {}

  getAsync(model: string): Observable<Message[]> {
    return this.http.get<Message[]>(`api/chat/${model}`).pipe(
      map((data) => {
        for (const record of data) {
          if (typeof record.timestamp === 'string') {
            record.timestamp = new Date(record.timestamp);
          }
        }
        return data;
      })
    );
  }

  putAsync(model: string, feed: Message[]): Observable<void> {
    return this.http.put<void>(`api/chat/${model}`, feed);
  }

  deleteAsync(model: string): Observable<void> {
    return this.http.delete<void>(`api/chat/${model}`);
  }
}
