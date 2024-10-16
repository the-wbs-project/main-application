import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { User, UserProfile } from '../models';

export class UserDataService {
  constructor(private readonly http: HttpClient) {}

  getProfileAsync(): Observable<UserProfile> {
    return this.http.get<UserProfile>('api/profile').pipe(
      tap((user) => {
        if (!user.showExternally) user.showExternally = [];
      })
    );
  }

  getSiteRolesAsync(): Observable<string[]> {
    return this.http.get<string[]>('api/site-roles');
  }

  putAsync(user: User): Observable<void> {
    return this.http.put<void>('api/profile', user);
  }

  putProfileAsync(user: UserProfile): Observable<void> {
    return this.http.put<void>('api/profile', user);
  }
}
