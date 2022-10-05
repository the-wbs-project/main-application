import { HttpClient } from '@angular/common/http';
import { Store } from '@ngxs/store';
import { Activity, ActivityData } from '@wbs/shared/models';
import { AuthState } from '@wbs/shared/states';
import { map, Observable } from 'rxjs';

export class ActivityDataService {
  constructor(
    private readonly http: HttpClient,
    private readonly store: Store
  ) {}

  getAsync(topLevelId: string): Observable<Activity[]> {
    return this.http.get<Activity[]>(`activity/${topLevelId}`);
  }

  getUserAsync(userId: string): Observable<Activity[]> {
    return this.http.get<Activity[]>(`activity/user/${userId}`);
  }

  putAsync(
    topLevelId: string,
    data: ActivityData,
    dataType: 'project'
  ): Observable<Activity> {
    const userId = this.store.selectSnapshot(AuthState.userId)!;

    return this.http.put<Activity>(`activity/${dataType}`, {
      ...data,
      topLevelId,
      userId,
    });
  }
}
