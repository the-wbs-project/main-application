import { HttpClient } from '@angular/common/http';
import { User } from '@wbs/shared/models';
import { Observable } from 'rxjs';

export class AuthDataService {
  constructor(private readonly http: HttpClient) {}

  getCurrentAsync(): Observable<User> {
    return this.http.get<User>('current');
  }
}
