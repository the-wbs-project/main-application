import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User, UserLite } from '../models';

export class UserDataService {
  constructor(private readonly http: HttpClient) {}

  getAllAsync(organization: string): Observable<User[]> {
    return this.http.get<User[]>(`api/users/${organization}`);
  }

  getAllLiteAsync(organization: string): Observable<UserLite[]> {
    return this.http.get<UserLite[]>(`api/users/${organization}/lite`);
  }

  postAsync(user: User): Observable<void> {
    return this.http.post<void>('api/user', user);
  }
}
