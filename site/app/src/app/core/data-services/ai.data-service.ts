import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {
  AiLog,
  AiModel,
  OpenAiRequest,
  OpenAiResults,
  WorkerAiRequest,
  WorkerAiResults,
} from '../models';

export class AiDataService {
  constructor(private readonly http: HttpClient) {}

  getModelsAsync(type: 'text'): Observable<AiModel[]> {
    return this.http.get<AiModel[]>(
      'https://ai.pm-empower.com/api/models/' + type
    );
  }

  runWorkerAiAsync(
    model: string,
    body: WorkerAiRequest
  ): Observable<WorkerAiResults> {
    return this.http
      .post<WorkerAiResults>('https://ai.pm-empower.com/api/run/worker-ai', {
        model,
        body,
      })
      .pipe(
        map((answer) => {
          if (answer.success) {
            answer.result.response = answer.result.response.trim();
          }
          return answer;
        })
      );
  }

  runOpenAiWorkerAsync(body: OpenAiRequest): Observable<OpenAiResults> {
    return this.http
      .post<OpenAiResults>('https://ai.pm-empower.com/api/run/open-ai', body)
      .pipe(
        map((answer) => {
          if (answer.choices) {
            for (const choice of answer.choices) {
              if (choice.message.content)
                choice.message.content = choice.message.content.trim();
            }
          }
          return answer;
        })
      );
  }

  getLogsAsync(): Observable<AiLog[]> {
    return this.http.get<AiLog[]>('https://ai.pm-empower.com/api/logs');
  }

  putLogAsync(log: AiLog): Observable<void> {
    return this.http.post<void>('https://ai.pm-empower.com/api/logs', log);
  }
}
