import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models';

export class AuthDataService {
  constructor(private readonly http: HttpClient) {}

  getCurrentAsync(): Observable<User> {
    return this.http.get<User>('current');
  }
}
