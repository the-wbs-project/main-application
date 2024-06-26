import { HttpClient } from '@angular/common/http';
import { IdService } from '@wbs/core/services';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Activity, ActivityData, ProjectActivityRecord } from '../models';

export class ActivityDataService {
  constructor(private readonly http: HttpClient) {}

  getTopLevelCountAsync(topLevelId: string): Observable<number> {
    return this.http.get<number>(`api/activities/topLevel/${topLevelId}/count`);
  }

  getTopLevelAsync(
    topLevelId: string,
    skip: number,
    take: number
  ): Observable<Activity[]> {
    return this.http
      .get<Activity[] | undefined>(
        `api/activities/topLevel/${topLevelId}/${skip}/${take}`
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

  saveAsync(userId: string, data: ActivityData[]): Observable<string[]> {
    const ids: string[] = [];
    const toSave: Activity[] = [];

    for (const d of data) {
      const id = IdService.generate();

      ids.push(id);
      toSave.push({
        ...d,
        id,
        timestamp: new Date(),
        userId: userId,
      });
    }
    return this.http.post<void>('api/activities', toSave).pipe(map(() => ids));
  }

  saveProjectActivitiesAsync(
    userId: string,
    data: ProjectActivityRecord[]
  ): Observable<string[]> {
    const ids: string[] = [];
    const toSave: any[] = [];

    for (const d of data) {
      const id = IdService.generate();

      ids.push(id);
      toSave.push({
        activity: {
          ...d.data,
          id,
          timestamp: new Date(),
          userId: userId,
        },
        project: d.project,
        nodes: d.nodes,
      });
    }
    return this.http
      .post<void>('api/activities/projects', toSave)
      .pipe(map(() => ids));
  }

  saveLibraryEntryAsync(data: Activity[]): Observable<void> {
    return this.http.post<void>('api/activities/library', data);
  }
}
