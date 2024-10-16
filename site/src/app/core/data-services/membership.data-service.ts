import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Membership, User } from '../models';

export class MembershipDataService {
  constructor(private readonly http: HttpClient) {}

  getMembershipsAsync(): Observable<Membership[]> {
    return this.http.get<Membership[]>('api/memberships');
  }

  getMembershipUsersAsync(organization: string): Observable<User[]> {
    return this.http.get<User[]>(`api/members/${organization}`);
  }

  putUserRolesAsync(
    organization: string,
    userId: string,
    roles: string[]
  ): Observable<void> {
    return this.http.put<void>(
      `api/members/${organization}/users/${userId}/roles`,
      roles
    );
  }
}
