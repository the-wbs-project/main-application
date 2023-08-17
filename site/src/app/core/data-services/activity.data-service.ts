import { HttpClient } from '@angular/common/http';
import { IdService } from '@wbs/core/services';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Activity, ActivityData } from '../models';

export class ActivityDataService {
  constructor(private readonly http: HttpClient) {}

  getAsync(
    skip: number,
    take: number,
    topLevelId: string,
    childId?: string
  ): Observable<Activity[]> {
    const url = childId
      ? `api/activity/child/${topLevelId}/${childId}/${skip}/${take}`
      : `api/activity/topLevel/${topLevelId}/${skip}/${take}`;

    return this.http
      .get<Activity[] | undefined>(url)
      .pipe(map((list) => list ?? []));
  }

  getUserAsync(organization: string, userId: string): Observable<Activity[]> {
    return this.http.get<Activity[]>(
      `api/activity/${organization}/user/${userId}`
    );
  }

  putAsync(
    userId: string,
    topLevelId: string,
    data: ActivityData,
    dataType: 'project'
  ): Observable<Activity> {
    const model: Activity = {
      ...data,
      id: IdService.generate(),
      timestamp: Date.now(),
      topLevelId,
      userId,
    };

    return this.http
      .put<void>(`api/activity/${dataType}`, model)
      .pipe(map(() => model));
  }
}
