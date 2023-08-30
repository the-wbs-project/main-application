import { HttpClient } from '@angular/common/http';
import { IdService } from '@wbs/core/services';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Activity, ActivityData, UserLite } from '../models';

export class ActivityDataService {
  constructor(private readonly http: HttpClient) {}

  getAsync(
    skip: number,
    take: number,
    topLevelId: string,
    childId?: string
  ): Observable<Activity[]> {
    const url = childId
      ? `api/activities/child/${topLevelId}/${childId}/${skip}/${take}`
      : `api/activities/topLevel/${topLevelId}/${skip}/${take}`;

    return this.http
      .get<Activity[] | undefined>(url)
      .pipe(map((list) => list ?? []));
  }

  getUserAsync(organization: string, userId: string): Observable<Activity[]> {
    return this.http.get<Activity[]>(
      `api/activities/${organization}/user/${userId}`
    );
  }

  putAsync(
    user: UserLite,
    topLevelId: string,
    data: ActivityData[]
  ): Observable<string[]> {
    const ids: string[] = [];
    const toSave: any[] = [];

    for (const d of data) {
      const id = IdService.generate();

      ids.push(id);
      toSave.push({
        ...d,
        id,
        timestamp: new Date(),
        topLevelId,
        userId: user.id,
      });
    }
    return this.http.put<void>('api/activities', toSave).pipe(map(() => ids));
  }
}
