import { HttpClient } from '@angular/common/http';
import { Message } from '@progress/kendo-angular-conversational-ui';
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
  ): Observable<Message[]> {
    return this.http
      .get<Message[] | undefined>(
        `api/chat/thread/${threadId}/comments/skip/${skip}/take/${take}`
      )
      .pipe(map((list) => this.cleanArray(list ?? [])));
  }

  getNewCommentCountAsync(
    threadId: string,
    timestamp: Date
  ): Observable<number> {
    return this.http.get<number>(
      `api/chat/thread/${threadId}/comments/${timestamp}/count`
    );
  }

  insertAsync(comment: ChatComment): Observable<Message> {
    return this.http
      .post<Message>(`api/chat/thread/${comment.threadId}`, comment)
      .pipe(map((message) => this.clean(message)));
  }

  private clean(nodes: Message): Message {
    Utils.cleanDates(nodes, 'timestamp');

    return nodes;
  }

  private cleanArray(nodes: Message[]): Message[] {
    Utils.cleanDates(nodes, 'timestamp');

    return nodes;
  }
}
