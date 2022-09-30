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

  putAsync(
    topLevelId: string,
    data: ActivityData,
    dataType: 'project'
  ): Observable<Activity> {
    const userId = this.store.selectSnapshot(AuthState.userId)!;
    const timestamp = this.getUTC();
    const activity: Activity = {
      ...data,
      timestamp,
      topLevelId,
      userId,
    };
    return this.http
      .put<void>(`activity/${dataType}`, activity)
      .pipe(map(() => activity));
  }

  private getUTC(): number {
    var now = new Date();
    return new Date(now.getTime() + now.getTimezoneOffset() * 60000).getTime();
  }
}
