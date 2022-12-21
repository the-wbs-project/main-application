import { HttpClient } from '@angular/common/http';
import { Store } from '@ngxs/store';
import { AuthState } from '@wbs/core/states';
import { Observable } from 'rxjs';
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
      `activity/${this.organization}/${topLevelId}`
    );
  }

  getUserAsync(userId: string): Observable<Activity[]> {
    return this.http.get<Activity[]>(
      `activity/${this.organization}/user/${userId}`
    );
  }

  putAsync(
    topLevelId: string,
    data: ActivityData,
    dataType: 'project'
  ): Observable<Activity> {
    const userId = this.store.selectSnapshot(AuthState.userId)!;

    return this.http.put<Activity>(
      `activity/${this.organization}/${dataType}`,
      {
        ...data,
        topLevelId,
        userId,
      }
    );
  }
}
