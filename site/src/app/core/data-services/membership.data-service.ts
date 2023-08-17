import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Member, Organization } from '../models';

export class MembershipDataService {
  constructor(private readonly http: HttpClient) {}

  getRolesAsync(): Observable<string[]> {
    return this.http.get<string[]>('api/roles');
  }

  getMembershipsAsync(): Observable<Organization[]> {
    return this.http.get<Organization[]>('api/memberships');
  }

  getMembershipRolesAsync(organization: string): Observable<string[]> {
    return this.http.get<string[]>(`api/memberships/${organization}/roles`);
  }

  getMembershipUsersAsync(organization: string): Observable<Member[]> {
    return this.http.get<Member[]>(`api/memberships/${organization}/users`);
  }

  getMembershipRolesForUserAsync(
    organization: string,
    user: string
  ): Observable<string[]> {
    return this.http.get<string[]>(
      `api/memberships/${organization}/users/${user}/roles`
    );
  }

  removeUserFromOrganizationAsync(
    organization: string,
    userId: string
  ): Observable<void> {
    return this.http.delete<void>(
      `api/memberships/${organization}/users/${userId}`
    );
  }

  addUserOrganizationalRolesAsync(
    organization: string,
    userId: string,
    roles: string[]
  ): Observable<void> {
    return this.http.post<void>(
      `api/memberships/${organization}/users/${userId}/roles`,
      roles
    );
  }

  removeUserOrganizationalRolesAsync(
    organization: string,
    user: string,
    roles: string[]
  ): Observable<void> {
    return this.http.delete<void>(
      `api/memberships/${organization}/users/${user}/roles`,
      {
        body: roles,
      }
    );
  }
}
