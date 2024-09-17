import { HttpClient } from '@angular/common/http';
import { IdService } from '@wbs/core/services';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Activity, ActivityData } from '../models';

export class ActivityDataService {
  constructor(private readonly http: HttpClient) {}

  getTopLevelCountAsync(topLevelId: string): Observable<number> {
    return this.http.get<number>(`api/activities/topLevel/${topLevelId}/count`);
  }

  getTopLevelAsync(
    owner: string,
    topLevelId: string,
    skip: number,
    take: number
  ): Observable<Activity[]> {
    return this.http
      .get<Activity[] | undefined>(
        `api/activities/topLevel/${owner}/${topLevelId}/${skip}/${take}`
      )
      .pipe(map((list) => list ?? []));
  }

  getChildCountAsync(topLevelId: string, childId: string): Observable<number> {
    return this.http.get<number>(
      `api/activities/topLevel/${topLevelId}/child/${childId}/count`
    );
  }

  getChildAsync(
    topLevelId: string,
    childId: string,
    skip: number,
    take: number
  ): Observable<Activity[]> {
    return this.http
      .get<Activity[] | undefined>(
        `api/activities/topLevel/${topLevelId}/child/${childId}/${skip}/${take}`
      )
      .pipe(map((list) => list ?? []));
  }

  getUserAsync(organization: string, userId: string): Observable<Activity[]> {
    return this.http.get<Activity[]>(
      `api/activities/${organization}/user/${userId}`
    );
  }

  postAsync(
    type: string,
    owner: string | undefined,
    userId: string,
    data: ActivityData[]
  ): Observable<void> {
    const ids: string[] = [];
    const activities: Activity[] = [];

    for (const d of data) {
      const id = IdService.generate();

      ids.push(id);
      activities.push({
        ...d,
        id,
        timestamp: new Date(),
        userId: userId,
      });
    }
    return this.http.post<void>(`api/activities`, { type, owner, activities });
  }
}
