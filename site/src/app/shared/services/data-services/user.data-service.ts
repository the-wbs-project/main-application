import { HttpClient } from '@angular/common/http';
import { User } from '@wbs/shared/models';
import { Observable } from 'rxjs';

export class UserDataService {
  constructor(private readonly http: HttpClient) {}

  getAllAsync(): Observable<User[]> {
    return this.http.get<User[]>('users');
  }

  postAsync(user: User): Observable<void> {
    return this.http.post<void>('user', user);
  }
}
