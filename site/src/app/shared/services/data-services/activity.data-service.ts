import { HttpClient } from '@angular/common/http';
import { Store } from '@ngxs/store';
import { Activity, ActivityData } from '@wbs/shared/models';
import { AuthState } from '@wbs/shared/states';
import { Observable } from 'rxjs';
import { ActivityService } from '../activity.service';

export class ActivityDataService {
  constructor(
    private readonly service: ActivityService,
    private readonly http: HttpClient,
    private readonly store: Store
  ) {}

  getAsync(topLevelId: string): Observable<Activity[]> {
    return this.http.get<Activity[]>(`activity/${topLevelId}`);
  }

  putAsync(data: ActivityData): void {
    console.log(data);
    const userId = this.store.selectSnapshot(AuthState.userId)!;
    const timestamp = this.getUTC();
    const label = this.service.getLabel(data);

    const activity: Activity = {
      ...data,
      label,
      timestamp,
      userId,
    };
    this.http.put<void>('activity', activity).subscribe();
  }

  private getUTC(): number {
    var now = new Date();
    return new Date(now.getTime() + now.getTimezoneOffset() * 60000).getTime();
  }
}
