import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Invite, InviteBody, Organization } from '../models';
import { UserViewModel } from '../view-models';

export class MembershipDataService {
  constructor(private readonly http: HttpClient) {}

  getMembershipsAsync(): Observable<Organization[]> {
    return this.http.get<Organization[]>('api/memberships');
  }

  getMembershipUsersAsync(
    organization: string,
    forceRefresh = false
  ): Observable<UserViewModel[]> {
    return this.http.get<UserViewModel[]>(
      `api/organizations/${organization}/members`,
      {
        headers: {
          'force-refresh': forceRefresh.toString(),
        },
      }
    );
  }

  getInvitesAsync(organization: string): Observable<Invite[]> {
    return this.http.get<Invite[]>(`api/organizations/${organization}/invites`);
  }

  sendInviteAsync(
    organization: string,
    inviteBody: InviteBody
  ): Observable<void> {
    return this.http.post<void>(
      `api/organizations/${organization}/invites`,
      inviteBody
    );
  }

  cancelInviteAsync(organization: string, inviteId: string): Observable<void> {
    return this.http.delete<void>(
      `api/organizations/${organization}/invites/${inviteId}`
    );
  }

  removeUserFromOrganizationAsync(
    organization: string,
    user: string
  ): Observable<void> {
    return this.http.delete<void>(
      `api/organizations/${organization}/members/${user}`
    );
  }

  addUserOrganizationalRolesAsync(
    organization: string,
    user: string,
    roles: string[]
  ): Observable<void> {
    return this.http.put<void>(
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
