import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Member, Organization } from '../models';

export class MembershipDataService {
  constructor(private readonly http: HttpClient) {}

  getRolesAsync(userId: string): Observable<string[]> {
    return this.http.get<string[]>(`api/users/${userId}/roles`);
  }

  getMembershipUsersAsync(organization: string): Observable<Member[]> {
    return this.http.get<Member[]>(`api/organizations/${organization}/members`);
  }

  removeUserFromOrganizationAsync(
    organization: string,
    user: string
  ): Observable<void> {
    return this.http.delete<void>(
      `api/organizations/${organization}/members/${user}`
    );
  }

  getMembershipRolesForUserAsync(
    organization: string,
    user: string
  ): Observable<string[]> {
    return this.http.get<string[]>(
      `api/organizations/${organization}/members/${user}/roles`
    );
  }

  addUserOrganizationalRolesAsync(
    organization: string,
    user: string,
    roles: string[]
  ): Observable<void> {
    return this.http.post<void>(
      `api/organizations/${organization}/members/${user}/roles`,
      roles
    );
  }

  removeUserOrganizationalRolesAsync(
    organization: string,
    user: string,
    roles: string[]
  ): Observable<void> {
    return this.http.delete<void>(
      `api/organizations/${organization}/members/${user}/roles`,
      {
        body: roles,
      }
    );
  }
}
