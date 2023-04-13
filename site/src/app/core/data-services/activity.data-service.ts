import { HttpClient } from '@angular/common/http';
import { Store } from '@ngxs/store';
import { IdService } from '@wbs/core/services';
import { AuthState } from '@wbs/core/states';
import { Observable, map } from 'rxjs';
import { Activity, ActivityData } from '../models';

export class ActivityDataService {
  constructor(
    private readonly http: HttpClient,
    private readonly store: Store
  ) {}

  private get organization(): string {
    return this.store.selectSnapshot(AuthState.organization)!;
  }

  getAsync(topLevelId: string): Observable<Activity[]> {
    return this.http.get<Activity[]>(
      `api/activity/${this.organization}/${topLevelId}`
    );
  }

  getUserAsync(userId: string): Observable<Activity[]> {
    return this.http.get<Activity[]>(
      `api/activity/${this.organization}/user/${userId}`
    );
  }

  putAsync(
    topLevelId: string,
    data: ActivityData,
    dataType: 'project'
  ): Observable<Activity> {
    const userId = this.store.selectSnapshot(AuthState.userId)!;
    const model: Activity = {
      ...data,
      id: IdService.generate(),
      timestamp: Date.now(),
      topLevelId,
      userId,
    };

    return this.http
      .put<void>(`api/activity/${this.organization}/${dataType}`, model)
      .pipe(map(() => model));
  }
}
