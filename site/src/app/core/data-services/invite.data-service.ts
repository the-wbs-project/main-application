import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Invite } from '../models';

export class InviteDataService {
  constructor(private readonly http: HttpClient) {}

  getAllAsync(): Observable<Invite[]> {
    return this.http.get<Invite[]>('api/invites');
  }

  putAsync(invite: Invite, send: boolean): Observable<Invite> {
    return this.http.put<Invite>(`api/invites/${send}`, invite);
  }
}
