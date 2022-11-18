import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User, UserLite } from '../models';

export class UserDataService {
  constructor(private readonly http: HttpClient) {}

  getAllAsync(): Observable<User[]> {
    return this.http.get<User[]>('users');
  }

  getAllLiteAsync(): Observable<UserLite[]> {
    return this.http.get<UserLite[]>('users/lite');
  }

  postAsync(user: User): Observable<void> {
    return this.http.post<void>('user', user);
  }
}
