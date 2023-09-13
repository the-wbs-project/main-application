import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models';

export class UserDataService {
  constructor(private readonly http: HttpClient) {}

  getAsync(userId: string): Observable<User> {
    return this.http.get<User>(`api/users/${userId}`);
  }

  putAsync(user: User): Observable<void> {
    return this.http.put<void>(`api/users/${user.id}`, user);
  }
}
