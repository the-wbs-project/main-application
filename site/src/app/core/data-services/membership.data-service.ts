import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Organization, Role, UserLite } from '../models';

export class MembershipDataService {
  constructor(private readonly http: HttpClient) {}

  getRolesAsync(): Observable<Role[]> {
    return this.http.get<Role[]>('api/roles');
  }

  getMembershipsAsync(): Observable<Organization[]> {
    return this.http.get<Organization[]>('api/memberships');
  }

  getMembershipRolesAsync(organization: string): Observable<Role[]> {
    return this.http.get<Role[]>(`api/memberships/${organization}/roles`);
  }

  getMembershipUsersAsync(organization: string): Observable<UserLite[]> {
    return this.http.get<UserLite[]>(`api/memberships/${organization}/users`);
  }

  getMembershipRolesForUserAsync(
    organization: string,
    user: string
  ): Observable<Role[]> {
    return this.http.get<Role[]>(
      `api/memberships/${organization}/users/${user}/roles`
    );
  }
}
