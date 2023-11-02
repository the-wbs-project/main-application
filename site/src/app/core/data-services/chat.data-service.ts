import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ChatComment } from '../models';
import { Utils } from '../services';

export class ChatDataService {
  constructor(private readonly http: HttpClient) {}

  getPageAsync(
    threadId: string,
    skip: number,
    take: number
  ): Observable<ChatComment[]> {
    return this.http
      .get<ChatComment[] | undefined>(
        `thread/${threadId}/comments/skip/${skip}/take/${take}`
      )
      .pipe(map((list) => this.clean(list ?? [])));
  }

  getNewCommentCountAsync(
    threadId: string,
    timestamp: Date
  ): Observable<number> {
    return this.http.get<number>(
      `api/thread/${threadId}/comments/${timestamp}/count`
    );
  }

  insertAsync(comment: ChatComment): Observable<void> {
    return this.http.put<void>(`api/chat/thread/${comment.threadId}`, comment);
  }

  private clean(nodes: ChatComment[]): ChatComment[] {
    Utils.cleanDates(nodes, 'timestamp');

    return nodes;
  }
}
