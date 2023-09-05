import { HttpClient } from '@angular/common/http';
import { IdService } from '@wbs/core/services';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {
  Activity,
  ActivityData,
  Project,
  ProjectActivityRecord,
  ProjectNode,
  UserLite,
} from '../models';

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
    console.log(toSave);
    return this.http.put<void>('api/activities', toSave).pipe(map(() => ids));
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
      .put<void>('api/activities/projects', toSave)
      .pipe(map(() => ids));
  }
}
