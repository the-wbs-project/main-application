import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User, UserLite } from '../models';

export class UserDataService {
  constructor(private readonly http: HttpClient) {}

  getAsync(userId: string): Observable<UserLite> {
    return this.http.get<UserLite>(`api/users/${userId}`);
  }

  postAsync(user: User): Observable<void> {
    return this.http.post<void>('api/user', user);
  }
}
