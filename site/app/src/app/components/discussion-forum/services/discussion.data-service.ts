import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '@wbs/core/models';
import { Observable } from 'rxjs';
import { Discussion } from '../models';

@Injectable()
export class DiscussionDataService {
  constructor(private readonly http: HttpClient) {}

  getAsync(
    organization: string,
    associationId: string,
    threadId?: string
  ): Observable<Discussion[]> {
    const parts = ['discussions', organization, associationId];

    if (threadId) parts.push(threadId);

    return this.http.get<Discussion[]>(parts.join('/'));
  }

  getUsersAsync(
    organization: string,
    associationId: string
  ): Observable<User[]> {
    return this.http.get<User[]>(
      `discussions/${organization}/${associationId}/users`
    );
  }

  putAsync(organization: string, model: Discussion): Observable<void> {
    return this.http.put<void>(
      `discussions/${organization}/${model.id}`,
      model
    );
  }
}
