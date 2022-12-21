import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { DataServiceFactory } from '../data-services';
import { Discussion } from '../models';
import { DiscussionViewModel } from '../view-models';

@Injectable({ providedIn: 'root' })
export class DiscussionService {
  constructor(private readonly data: DataServiceFactory) {}

  build(
    organization: string,
    associationId: string
  ): Observable<DiscussionViewModel[]> {
    return this.data.discussions.getAsync(organization, associationId).pipe(
      map((x) => x.sort(sort)),
      map((discussions) => this.buildChildren(undefined, discussions))
    );
  }

  private buildChildren(
    replyToId: string | undefined,
    discussions: Discussion[]
  ): DiscussionViewModel[] {
    return discussions
      .filter((x) => x.replyToId === replyToId)
      .map(
        (x) =>
          <DiscussionViewModel>{
            ...x,
            children: this.buildChildren(x.id, discussions),
          }
      );
  }
}

const sort = (a: Discussion, b: Discussion) => a.timestamp - b.timestamp;
