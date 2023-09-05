import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserLite } from '../models';

export class UserDataService {
  constructor(private readonly http: HttpClient) {}

  getAsync(userId: string): Observable<UserLite> {
    return this.http.get<UserLite>(`api/users/${userId}`);
  }

  putAsync(user: UserLite): Observable<void> {
    return this.http.put<void>(`api/users/${user.id}`, user);
  }
}
