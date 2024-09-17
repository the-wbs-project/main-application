import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Role, User } from '../models';
import { UserViewModel } from '../view-models';

export class UserDataService {
  constructor(private readonly http: HttpClient) {}

  getAsync(
    organization: string,
    userId: string
  ): Observable<UserViewModel | undefined> {
    return this.http.get<UserViewModel | undefined>(
      `api/users/${organization}/${userId}`
    );
  }

  getProfileAsync(): Observable<User> {
    return this.http.get<User>('api/profile');
  }

  getSiteRolesAsync(): Observable<Role[]> {
    return this.http.get<Role[]>('api/site-roles');
  }

  putAsync(user: User): Observable<void> {
    return this.http.put<void>('api/profile', user);
  }
}
